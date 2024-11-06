package com.cpe.springboot.card_generator.card_generator.listener;

import com.cpe.springboot.activemq.AbstractJmsListener;
import com.cpe.springboot.activemq.ActiveMQ;
import com.cpe.springboot.activemq.ActiveMQListener;
import com.cpe.springboot.card_generator.card_generator.model.Transaction;
import com.cpe.springboot.card_generator.card_generator.service.CardGeneratorService;
import com.cpe.springboot.card_generator.card_generator.service.InternalCardService;
import com.cpe.springboot.dto.CardDTO;
import com.cpe.springboot.dto.queues.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.jms.JMSException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.query.criteria.JpaRoot;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

import static com.cpe.springboot.card_generator.card_generator.common.Constants.ACTIVEMQ_QUEUE_CREATED_CARD;
import static com.cpe.springboot.card_generator.card_generator.common.Constants.CARD_DEFAULT_PRICE;

@Slf4j
@Component
public class AsyncTasksListener extends AbstractJmsListener {

    private InternalCardService internalCardService;

    public AsyncTasksListener(ObjectMapper objectMapper, JmsTemplate jmsTemplate, InternalCardService internalCardService, ActiveMQ activeMQ) {
        super(objectMapper, jmsTemplate, activeMQ);
        this.internalCardService = internalCardService;
    }

    @Override
    public GenericMQDTO traitementService(Object object) {
        log.info("[AsyncTasksListener] Asynchronous tasks listener starting.");
        Transaction transaction = null;

        if (object instanceof ImageDTO) {

            transaction = internalCardService.proceedImageMessage((ImageDTO) object);

        } else if (object instanceof DescriptionDTO) {

            transaction = internalCardService.proceedDescriptionMessage((DescriptionDTO) object);

        } else if (object instanceof PropertiesDTO) {

            transaction = internalCardService.proceedPropertiesMessage((PropertiesDTO) object);

        }

        log.info("[AsyncTasksListener] IsCardComplete {}", transaction);
        if (transaction != null && internalCardService.isCardComplete(transaction)) {
            CreatedCardDTO c = new CreatedCardDTO(transaction.getUserId(), transaction.getImageUrl(), transaction.isBase64(),
                    transaction.getDescription(), transaction.getHp(), transaction.getEnergy(), transaction.getAttack(),
                    transaction.getDefense(), CARD_DEFAULT_PRICE);
            c.transactionId = transaction.getId();
            this.activeMQ.publish(c, ACTIVEMQ_QUEUE_CREATED_CARD);
        }
        return null;
    }
}
