package com.cpe.springboot.card.listener;

import com.cpe.springboot.activemq.ActiveMQListener;
import com.cpe.springboot.card.Controller.CardModelService;
import com.cpe.springboot.dto.queues.PropertiesDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.jms.JMSException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.core.JmsTemplate;

@AllArgsConstructor
@Slf4j
public class GeneratedCardsListener extends ActiveMQListener {

    private CardModelService cardModelService;

    @Override
    public void performAction() {
        log.info("[GeneratedCardsListener] Generated cards listener starting");
        while(true){
            try {
                cardModelService.proceedGeneratedCardMessage();
            } catch (JMSException e) {
                throw new RuntimeException(e);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
