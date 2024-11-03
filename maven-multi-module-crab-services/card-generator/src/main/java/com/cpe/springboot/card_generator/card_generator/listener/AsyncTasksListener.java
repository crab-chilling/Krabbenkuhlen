package com.cpe.springboot.card_generator.card_generator.listener;

import com.cpe.springboot.activemq.ActiveMQListener;
import com.cpe.springboot.card_generator.card_generator.model.Transaction;
import com.cpe.springboot.card_generator.card_generator.service.CardGeneratorService;
import com.cpe.springboot.dto.CardDTO;
import com.cpe.springboot.dto.queues.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.jms.JMSException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.query.criteria.JpaRoot;
import org.springframework.jms.core.JmsTemplate;

import static com.cpe.springboot.card_generator.card_generator.common.Constants.ACTIVEMQ_QUEUE_CREATED_CARD;
import static com.cpe.springboot.card_generator.card_generator.common.Constants.CARD_DEFAULT_PRICE;

@AllArgsConstructor
@Slf4j
public class AsyncTasksListener extends ActiveMQListener {

    private CardGeneratorService cardGeneratorService;

    private JmsTemplate jmsTemplate;

    @Override
    public void performAction() {
        log.info("[AsyncTasksListener] Asynchronous tasks listener starting.");
        while(true) {
            GenericMQDTO genericMQDTO = null;
            try  {
                genericMQDTO = cardGeneratorService.receiveTransactionMessage();
            } catch (JMSException e) {
                throw new RuntimeException(e);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }

            if (genericMQDTO == null) {
                continue;
            }

            Transaction transaction = null;

            if (genericMQDTO instanceof ImageDTO) {

                transaction = cardGeneratorService.proceedImageMessage((ImageDTO) genericMQDTO);

            } else if (genericMQDTO instanceof DescriptionDTO) {

                transaction = cardGeneratorService.proceedDescriptionMessage((DescriptionDTO) genericMQDTO);

            } else if (genericMQDTO instanceof PropertiesDTO) {

                transaction = cardGeneratorService.proceedPropertiesMessage((PropertiesDTO) genericMQDTO);
                
            }

            if (transaction != null && cardGeneratorService.isCardComplete(transaction)) {
                jmsTemplate.convertAndSend(ACTIVEMQ_QUEUE_CREATED_CARD, new CreatedCardDTO(transaction.getUserId(), transaction.getImage().getImageUrl(), transaction.getImage().isBase64(),
                        transaction.getDescription().getDescription(), transaction.getProperties().getHp(), transaction.getProperties().getEnergy(), transaction.getProperties().getAttack(),
                        transaction.getProperties().getDefense(), CARD_DEFAULT_PRICE));
            }
        }
    }
}
