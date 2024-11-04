package com.cpe.springboot.activemq;

import com.cpe.springboot.dto.queues.GenericMQDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import lombok.AllArgsConstructor;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public abstract class AbstractJmsListener {

    private ObjectMapper objectMapper;
    private JmsTemplate jmsTemplate;

    public abstract GenericMQDTO traitementService(Object object);

    public void doReceive(TextMessage message, String queue) throws JMSException, ClassNotFoundException, JsonProcessingException {
        String clazz = message.getStringProperty("ObjectType");
        Object o = objectMapper.readValue(message.getText(), Class.forName(clazz));
        GenericMQDTO dto = this.traitementService(o);
        jmsTemplate.convertAndSend(queue, dto);
    }
}
