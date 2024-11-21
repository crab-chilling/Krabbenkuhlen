package com.cpe.springboot.cardPropertiesService;

import com.cpe.springboot.activemq.AbstractJmsListener;
import com.cpe.springboot.activemq.ActiveMQ;
import com.cpe.springboot.cardPropertiesService.service.PropertiesService;
import com.cpe.springboot.dto.queues.GenericMQDTO;
import com.cpe.springboot.dto.queues.ImageDTO;
import com.cpe.springboot.dto.queues.PropertiesDTO;
import com.cpe.springboot.dto.requests.PropertiesTransactionDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

import static com.cpe.springboot.common.Constants.ACTIVEMQ_QUEUE_TASK;

@Component
public class AsyncListener extends AbstractJmsListener {

    private final PropertiesService service;
    public AsyncListener(ObjectMapper objectMapper, ActiveMQ activeMQ, PropertiesService service) {
        super(objectMapper, activeMQ);
        this.service = service;
    }

    @Override
    @JmsListener(destination = "properties", containerFactory = "queueConnectionFactory")
    public void traitementService(TextMessage textMessage) throws JMSException, JsonProcessingException, ClassNotFoundException {

        GenericMQDTO object = (GenericMQDTO) messageToObject(textMessage);

        if (object instanceof ImageDTO imageDTO) {
            PropertiesDTO propertiesDTO = service.getPropertiesFromImgUrl(imageDTO);
            this.activeMQ.publish(propertiesDTO, ACTIVEMQ_QUEUE_TASK);
        }
    }
}
