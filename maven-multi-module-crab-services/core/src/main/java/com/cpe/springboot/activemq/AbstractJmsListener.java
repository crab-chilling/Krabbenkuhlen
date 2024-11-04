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
    protected JmsTemplate jmsTemplate;
    protected ActiveMQ activeMQ;

    public abstract GenericMQDTO traitementService(Object object);

    public void doReceive(TextMessage message, String queue) throws JMSException, ClassNotFoundException, JsonProcessingException {
        String clazz = message.getStringProperty("ObjectType");
        if(clazz == null){
            return;
        }
        Object o = objectMapper.readValue(message.getText(), Class.forName(clazz));
        if (o == null) {
            return;
        }
        GenericMQDTO dto = this.traitementService(o);
        if (dto == null) {
            return;
        }
        activeMQ.publish(dto, "tasks");
    }
}
