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
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@Component
public class AsyncListener extends AbstractJmsListener {

    private final PropertiesService service;
    public AsyncListener(ObjectMapper objectMapper, JmsTemplate jmsTemplate, ActiveMQ activeMQ, PropertiesService service) {
        super(objectMapper, jmsTemplate, activeMQ);
        this.service = service;
    }

    @Override
    public GenericMQDTO traitementService(Object object) {
        PropertiesDTO dto = null;
        if(object instanceof ImageDTO){
            try {
                dto = service.getPropertiesFromImgUrl(((ImageDTO)object));
            } catch (JMSException | JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }
        return dto;
    }
}
