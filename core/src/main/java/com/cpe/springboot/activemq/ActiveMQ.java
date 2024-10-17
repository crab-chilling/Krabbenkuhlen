package com.cpe.springboot.activemq;

import com.cpe.springboot.dto.GenericMQDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@Slf4j
public class ActiveMQ {

    JmsTemplate jmsTemplate;

    ObjectMapper objectMapper;

    public ActiveMQ(JmsTemplate jmsTemplate, ObjectMapper objectMapper) {
        this.jmsTemplate = jmsTemplate;
        this.objectMapper = objectMapper;
    }

    public <T extends GenericMQDTO> void publish(T genericMQDTO, String queueName) {
        log.info("[ActiveMQCore] Send message :" + genericMQDTO);
        jmsTemplate.send(queueName, s -> {
            try {
                TextMessage msg = s.createTextMessage(objectMapper.writeValueAsString(genericMQDTO));
                msg.setStringProperty("Content-Type", "application/json");
                msg.setStringProperty("ObjectType", genericMQDTO.getClass().getCanonicalName());

                return msg;
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        });
        log.info("[ActiveMQCore] Message sent");

    }

    /*@JmsListener(destination = "tasks", containerFactory = "queueConnectionFactory")
    public GenericMQDTO receiveMessage(String queueName) throws JMSException, JsonProcessingException {
        String message = jmsTemplate.receive(queueName).getBody(String.class);
        if(message != null){
            PropertiesTransactionDTO dto = objectMapper.readValue(message, PropertiesTransactionDTO.class);
            return dto;
        }else {
            return null;
        }
    }*/

    public void startListener(ActiveMQListener activeMQListener){
        Thread thread = new Thread(activeMQListener);
        thread.start();
    }
}
