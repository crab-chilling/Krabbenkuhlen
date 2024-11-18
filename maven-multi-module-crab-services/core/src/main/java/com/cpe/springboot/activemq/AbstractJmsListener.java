package com.cpe.springboot.activemq;

import com.cpe.springboot.dto.queues.GenericMQDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public abstract class AbstractJmsListener {

    protected ObjectMapper objectMapper;
    protected ActiveMQ activeMQ;

    public abstract void traitementService(TextMessage textMessage) throws JsonProcessingException, JMSException;

    public Object messageToObject(TextMessage message) throws JMSException, JsonProcessingException {
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return objectMapper.readValue(message.getText(), Object.class);
    }
}
