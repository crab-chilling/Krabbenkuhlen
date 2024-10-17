package com.cpe.springboot.cardPropertiesService;

import com.cpe.springboot.cardPropertiesService.configuration.ActiveMQConfiguration;
import com.cpe.springboot.cardPropertiesService.dto.PropertiesDTO;
import com.cpe.springboot.cardPropertiesService.service.PropertiesService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.jms.JMSException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Slf4j
public class ActiveMQListener implements Runnable {

    private PropertiesService service;
    private JmsTemplate jmsTemplate;

    @Override
    public void run() {
        log.info("[ActiveMQListener] ActiveMQ Listener starting");
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
            log.info("[ActiveMQListener] Properties sent on result queue");
        }
    }
}
