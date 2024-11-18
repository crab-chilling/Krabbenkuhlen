package com.cpe.springboot.card_generator.card_generator.listener;

import com.cpe.springboot.activemq.AbstractJmsListener;
import com.cpe.springboot.activemq.ActiveMQ;
import com.cpe.springboot.card_generator.card_generator.model.Transaction;
import com.cpe.springboot.card_generator.card_generator.service.CardGeneratorService;
import com.cpe.springboot.dto.queues.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import static com.cpe.springboot.common.Constants.ACTIVEMQ_QUEUE_CREATED_CARD;
import static com.cpe.springboot.common.Constants.CARD_DEFAULT_PRICE;

@Slf4j
@Component
public class AsyncTasksListener extends AbstractJmsListener {

    private final CardGeneratorService cardGeneratorService;

    public AsyncTasksListener(ObjectMapper objectMapper, CardGeneratorService cardGeneratorService, ActiveMQ activeMQ) {
        super(objectMapper, activeMQ);
        this.cardGeneratorService = cardGeneratorService;
    }

    @Override
    @Transactional
    @JmsListener(destination = "tasks", containerFactory = "queueConnectionFactory")
    public void traitementService(TextMessage textMessage) throws JMSException, JsonProcessingException {

        Object object = messageToObject(textMessage);

        log.info("[AsyncTasksListener] Asynchronous tasks listener starting.");
        Transaction transaction = null;

        if (object instanceof ImageDTO imageDTO) {

            transaction = cardGeneratorService.proceedImageMessage(imageDTO);

        } else if (object instanceof DescriptionDTO descriptionDTO) {

            transaction = cardGeneratorService.proceedDescriptionMessage(descriptionDTO);

        } else if (object instanceof PropertiesDTO propertiesDTO) {

            transaction = cardGeneratorService.proceedPropertiesMessage(propertiesDTO);

        }

        log.info("[AsyncTasksListener] IsCardComplete {}", transaction);
        if (transaction != null && cardGeneratorService.isCardComplete(transaction)) {
            CreatedCardDTO c = new CreatedCardDTO(transaction.getUserId(), transaction.getImageUrl(), transaction.isBase64(),
                    transaction.getDescription(), transaction.getHp(), transaction.getEnergy(), transaction.getAttack(),
                    transaction.getDefense(), CARD_DEFAULT_PRICE);
            c.transactionId = transaction.getId();
            this.activeMQ.publish(c, ACTIVEMQ_QUEUE_CREATED_CARD);
        }
    }
}
