package com.cpe.springboot.card_generator.card_generator.service;

import com.cpe.springboot.activemq.ActiveMQ;
import com.cpe.springboot.card_generator.card_generator.listener.AsyncTasksListener;
import com.cpe.springboot.card_generator.card_generator.model.Transaction;
import com.cpe.springboot.card_generator.card_generator.repository.TransactionRepository;
import com.cpe.springboot.dto.AsyncResponseDTO;
import com.cpe.springboot.dto.enums.Status;
import com.cpe.springboot.dto.queues.GenericAsyncTaskDTO;
import com.cpe.springboot.dto.requests.CardGeneratorTransactionDTO;
import com.cpe.springboot.dto.requests.DescriptionTransactionDTO;
import com.cpe.springboot.dto.requests.ImageTransactionDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.jms.JMSException;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import static com.cpe.springboot.card_generator.card_generator.common.Constants.*;


@Service
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

    public GenericAsyncTaskDTO receiveTransactionMessage() throws JMSException, JsonProcessingException {
        String message = jmsTemplate.receive(ACTIVEMQ_QUEUE_TASK).getBody(String.class);
        if(message != null){
            return objectMapper.readValue(message, GenericAsyncTaskDTO.class);
        }else {
            return null;
        }
    }
}
