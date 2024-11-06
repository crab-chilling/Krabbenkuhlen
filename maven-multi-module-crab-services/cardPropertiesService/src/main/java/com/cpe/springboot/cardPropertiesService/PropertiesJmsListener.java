package com.cpe.springboot.cardPropertiesService;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@AllArgsConstructor
public class PropertiesJmsListener {

    private final AsyncListener asyncListener;
    @JmsListener(destination = "properties", containerFactory = "queueConnectionFactory")
    public void receiveTransactionMessage(TextMessage message) throws JMSException, JsonProcessingException, ClassNotFoundException {
        log.info("Receiving message from properties queue");
        asyncListener.doReceive(message, "tasks");
    }
}
