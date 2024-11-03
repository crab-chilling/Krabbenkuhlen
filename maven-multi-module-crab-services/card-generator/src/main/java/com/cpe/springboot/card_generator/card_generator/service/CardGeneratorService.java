package com.cpe.springboot.card_generator.card_generator.service;

import com.cpe.springboot.activemq.ActiveMQ;
import com.cpe.springboot.card_generator.card_generator.listener.AsyncTasksListener;
import com.cpe.springboot.card_generator.card_generator.model.Description;
import com.cpe.springboot.card_generator.card_generator.model.Image;
import com.cpe.springboot.card_generator.card_generator.model.Properties;
import com.cpe.springboot.card_generator.card_generator.model.Transaction;
import com.cpe.springboot.card_generator.card_generator.repository.TransactionRepository;
import com.cpe.springboot.dto.AsyncResponseDTO;
import com.cpe.springboot.dto.enums.Status;
import com.cpe.springboot.dto.queues.DescriptionDTO;
import com.cpe.springboot.dto.queues.GenericAsyncTaskDTO;
import com.cpe.springboot.dto.queues.GenericMQDTO;
import com.cpe.springboot.dto.queues.ImageDTO;
import com.cpe.springboot.dto.queues.PropertiesDTO;
import com.cpe.springboot.dto.requests.CardGeneratorTransactionDTO;
import com.cpe.springboot.dto.requests.DescriptionTransactionDTO;
import com.cpe.springboot.dto.requests.ImageTransactionDTO;
import com.cpe.springboot.dto.requests.PropertiesTransactionDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonAppend;
import jakarta.jms.JMSException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Optional;

import static com.cpe.springboot.card_generator.card_generator.common.Constants.*;


@Service
@Slf4j
public class CardGeneratorService {

    private final WebClient.Builder webClientBuilder;

    private TransactionRepository repository;

    private final JmsTemplate jmsTemplate;

    private ActiveMQ activeMQ;

    private ObjectMapper objectMapper;

    public CardGeneratorService(WebClient.Builder webClientBuilder, TransactionRepository repository, JmsTemplate jmsTemplate, ActiveMQ activeMQ, ObjectMapper objectMapper) {

        this.webClientBuilder = webClientBuilder;
        this.repository = repository;
        this.jmsTemplate = jmsTemplate;
        this.activeMQ = activeMQ;
        this.objectMapper = objectMapper;

        activeMQ.startListener(new AsyncTasksListener(this, this.jmsTemplate));
    }

    public AsyncResponseDTO generateCard(CardGeneratorTransactionDTO cardGeneratorTransactionDTO) {

        Transaction transaction = new Transaction(cardGeneratorTransactionDTO.getUserId(), cardGeneratorTransactionDTO.getImagePrompt(), cardGeneratorTransactionDTO.getDescPrompt());

        repository.save(transaction);

        AsyncResponseDTO asyncResponseDTO = webClientBuilder.build()
                        .post()
                        .uri(URL_ASYNC_WORKER_SERVICE + ENDPOINT_ASYNC_WORKER_IMAGE)
                        .bodyValue(new ImageTransactionDTO(transaction.getUserId(), transaction.getImagePrompt()))
                        .retrieve()
                        .bodyToMono(AsyncResponseDTO.class)
                        .block();

        if (asyncResponseDTO == null || asyncResponseDTO.getStatus() == Status.KO){
            return new AsyncResponseDTO(Status.KO, "An error occured while trying to generate card image, please try again later.");
        }

        asyncResponseDTO = webClientBuilder.build()
                .post()
                .uri(URL_ASYNC_WORKER_SERVICE + ENDPOINT_ASYNC_WORKER_DESCRIPTION)
                .bodyValue(new DescriptionTransactionDTO(transaction.getUserId(), transaction.getDescPrompt()))
                .retrieve()
                .bodyToMono(AsyncResponseDTO.class)
                .block();

        if (asyncResponseDTO == null || asyncResponseDTO.getStatus() == Status.KO){
            return new AsyncResponseDTO(Status.KO, "An error occured while trying to generate card description, please try again later.");
        }

        return new AsyncResponseDTO(Status.OK, "Card generation has started successfully.");
    }

    @JmsListener(destination = "tasks", containerFactory = "queueConnectionFactory")
    public GenericMQDTO receiveTransactionMessage() throws JMSException, JsonProcessingException {
        String message = jmsTemplate.receive(ACTIVEMQ_QUEUE_TASK).getBody(String.class);
        if(message != null){
            return objectMapper.readValue(message, GenericMQDTO.class);
        }else {
            return null;
        }
    }

    public Transaction proceedImageMessage(ImageDTO imageDTO) {
        Optional<Transaction> o_transaction = repository.findById(imageDTO.getTransactionId());
        if (o_transaction.isEmpty()) {
            return null;
        }

        Image image = new Image(imageDTO.getImgUrl(), imageDTO.isBase64());

        Transaction transaction = o_transaction.get();
        transaction.setImage(image);
        repository.save(transaction);

        AsyncResponseDTO asyncResponseDTO = webClientBuilder.build()
                .post()
                .uri(URL_PROPERTIES_SERVICE + ENDPOINT_PROPERTIES)
                .bodyValue(new PropertiesTransactionDTO(transaction.getId(), imageDTO.getImgUrl(), imageDTO.isBase64()))
                .retrieve()
                .bodyToMono(AsyncResponseDTO.class)
                .block();

        if (asyncResponseDTO == null || asyncResponseDTO.getStatus() == Status.KO){
            log.error("An error occured while trying to generate card properties : {}.", asyncResponseDTO.getMessage());
            return null;
        }

        return transaction;
    }

    public Transaction proceedDescriptionMessage(DescriptionDTO descriptionDTO) {
        Optional<Transaction> o_transaction = repository.findById(descriptionDTO.getTransactionId());
        if (o_transaction.isEmpty()) {
            return null;
        }

        Description description = new Description(descriptionDTO.getDescription());

        Transaction transaction = o_transaction.get();
        transaction.setDescription(description);
        repository.save(transaction);

        return transaction;
    }

    public boolean isCardComplete(Transaction transaction) {
        if (transaction.getImage() != null && transaction.getDescription() != null && transaction.getProperties() != null) {
            return true;
        }
        return false;
    }

    public Transaction proceedPropertiesMessage(PropertiesDTO propertiesDTO) {
        Optional<Transaction> o_transaction = repository.findById(propertiesDTO.getTransactionId());
        if (o_transaction.isEmpty()) {
            return null;
        }

        Properties properties = new Properties(propertiesDTO.getHp(), propertiesDTO.getEnergy(), propertiesDTO.getAttack(), propertiesDTO.getDefense());

        Transaction transaction = o_transaction.get();
        transaction.setProperties(properties);
        repository.save(transaction);

        return transaction;
    }

}
