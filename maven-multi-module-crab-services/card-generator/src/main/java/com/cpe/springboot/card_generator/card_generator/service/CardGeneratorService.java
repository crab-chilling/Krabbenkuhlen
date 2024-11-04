package com.cpe.springboot.card_generator.card_generator.service;

import com.cpe.springboot.activemq.ActiveMQ;
import com.cpe.springboot.card_generator.card_generator.listener.AsyncTasksListener;
import com.cpe.springboot.card_generator.card_generator.model.Description;
import com.cpe.springboot.card_generator.card_generator.model.Image;
import com.cpe.springboot.card_generator.card_generator.model.Properties;
import com.cpe.springboot.card_generator.card_generator.model.Transaction;
import com.cpe.springboot.card_generator.card_generator.repository.TransactionRepository;
import com.cpe.springboot.dto.enums.Status;
import com.cpe.springboot.dto.queues.DescriptionDTO;
import com.cpe.springboot.dto.queues.GenericMQDTO;
import com.cpe.springboot.dto.queues.ImageDTO;
import com.cpe.springboot.dto.queues.PropertiesDTO;
import com.cpe.springboot.dto.requests.CardGeneratorTransactionDTO;
import com.cpe.springboot.dto.requests.DescriptionTransactionDTO;
import com.cpe.springboot.dto.requests.ImageTransactionDTO;
import com.cpe.springboot.dto.requests.PropertiesTransactionDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Objects;
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
    private AsyncTasksListener asyncTasksListener;

    public CardGeneratorService(WebClient.Builder webClientBuilder, TransactionRepository repository, JmsTemplate jmsTemplate, ActiveMQ activeMQ, ObjectMapper objectMapper, AsyncTasksListener asyncTasksListener) {

        this.webClientBuilder = webClientBuilder;
        this.repository = repository;
        this.jmsTemplate = jmsTemplate;
        this.activeMQ = activeMQ;
        this.objectMapper = objectMapper;
        this.asyncTasksListener = asyncTasksListener;
    }

    public HttpStatus generateCard(CardGeneratorTransactionDTO cardGeneratorTransactionDTO) {
        log.info("Generating card for user {}.", cardGeneratorTransactionDTO.getUserId());

        Transaction transaction = new Transaction(cardGeneratorTransactionDTO.getUserId(), cardGeneratorTransactionDTO.getImagePrompt(), cardGeneratorTransactionDTO.getDescPrompt());

        repository.save(transaction);

        ResponseEntity res = webClientBuilder.build()
                        .post()
                        .uri(URL_ASYNC_WORKER_SERVICE + ENDPOINT_ASYNC_WORKER_IMAGE)
                        .bodyValue(new ImageTransactionDTO(transaction.getUserId(), transaction.getImagePrompt()))
                        .retrieve()
                        .toBodilessEntity()
                        .block();

        log.info("Response1 : {}.", res);

        if (res == null || res.getStatusCode().isError()){
            log.info("1 An error occured while trying to generate card image : {}.", res);
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }

        res = webClientBuilder.build()
                .post()
                .uri(URL_ASYNC_WORKER_SERVICE + ENDPOINT_ASYNC_WORKER_DESCRIPTION)
                .bodyValue(new DescriptionTransactionDTO(transaction.getUserId(), transaction.getDescPrompt()))
                .retrieve()
                .toBodilessEntity()
                .block();

        log.info("Response2 : {}.", res);

        if (res == null || res.getStatusCode().isError()){
            log.info("2 An error occured while trying to generate card description : {}.", res);
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return HttpStatus.OK;
    }

    @JmsListener(destination = "tasks", containerFactory = "queueConnectionFactory")
    public void receiveTransactionMessage(TextMessage message) throws JMSException, JsonProcessingException, ClassNotFoundException {
        log.info("Receiving transaction message.");
        //TextMessage message = jmsTemplate.receive(ACTIVEMQ_QUEUE_TASK)
        log.info("Received message : {}.", message);
        this.asyncTasksListener.doReceive(message, ACTIVEMQ_QUEUE_TASK);
    }

}
