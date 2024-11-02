package com.cpe.springboot.card_generator.card_generator.listener;

import com.cpe.springboot.activemq.ActiveMQListener;
import com.cpe.springboot.card_generator.card_generator.service.CardGeneratorService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.core.JmsTemplate;

@AllArgsConstructor
@Slf4j
public class AsyncTasksListener extends ActiveMQListener {

    private CardGeneratorService cardGeneratorService;

    private JmsTemplate jmsTemplate;

    @Override
    public void performAction() {
        log.info("[AsyncTasksListener] Asynchronous tasks listener starting.");
        while(true) {

        }
    }
}
