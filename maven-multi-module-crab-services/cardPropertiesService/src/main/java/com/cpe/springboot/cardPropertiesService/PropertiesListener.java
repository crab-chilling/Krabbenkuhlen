package com.cpe.springboot.cardPropertiesService;

import com.cpe.springboot.activemq.ActiveMQListener;
import com.cpe.springboot.cardPropertiesService.configuration.ActiveMQConfiguration;
import com.cpe.springboot.cardPropertiesService.service.PropertiesService;
import com.cpe.springboot.dto.queues.PropertiesDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.jms.JMSException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.core.JmsTemplate;

@AllArgsConstructor
@Slf4j
public class PropertiesListener extends ActiveMQListener {

    private PropertiesService service;
    private JmsTemplate jmsTemplate;

    @Override
    public void performAction() {
        log.info("[PropertiesListener] Properties Listener starting");
        while(true){
            PropertiesDTO dto = null;
            try {
                dto = service.getPropertiesFromImgUrl();
            } catch (JMSException | JsonProcessingException e) {
                throw new RuntimeException(e);
            }
            if(dto == null){
                continue;
            }
            jmsTemplate.convertAndSend(ActiveMQConfiguration.PROPERTIES_RESULT_QUEUE, dto);
            log.info("[PropertiesListener] Properties sent on result queue");
        }
    }
}
