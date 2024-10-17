package com.cpe.springboot.cardPropertiesService.service;

import com.cpe.springboot.activemq.ActiveMQ;
import com.cpe.springboot.cardPropertiesService.PropertiesListener;
import com.cpe.springboot.cardPropertiesService.configuration.ActiveMQConfiguration;
import com.cpe.springboot.cardPropertiesService.dto.PropertiesDTO;
import com.cpe.springboot.cardPropertiesService.dto.PropertiesTransactionDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.jms.JMSException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;
import tp.cpe.ImgToProperties;

import java.util.Map;

@Service
@AllArgsConstructor
@Slf4j
public class PropertiesService {

    private final JmsTemplate jmsTemplate;
    ObjectMapper objectMapper;

    ActiveMQ activeMQ;

    public void publish(PropertiesTransactionDTO transactionDTO) {
        activeMQ.publish(transactionDTO, ActiveMQConfiguration.PROPERTIES_OWN_QUEUE);
    }

    public void startActiveMqListener(){
        activeMQ.startListener(new PropertiesListener(this, jmsTemplate));
    }

    @JmsListener(destination = "tasks", containerFactory = "queueConnectionFactory")
    public PropertiesTransactionDTO receiveTransactionMessage() throws JMSException, JsonProcessingException {
        String message = jmsTemplate.receive(ActiveMQConfiguration.PROPERTIES_OWN_QUEUE).getBody(String.class);
        if(message != null){
            PropertiesTransactionDTO dto = objectMapper.readValue(message, PropertiesTransactionDTO.class);
            return dto;
        }else {
            return null;
        }
    }

    public PropertiesDTO getPropertiesFromImgUrl() throws JMSException, JsonProcessingException {
        PropertiesTransactionDTO transactionDTO = receiveTransactionMessage();
        if(transactionDTO == null){
            return null;
        }
        Map<String, Float> properties = ImgToProperties.getPropertiesFromImg(transactionDTO.getImgUrl(), 100f, 5, 0.2f, transactionDTO.isBase64());
        return new PropertiesDTO(properties.get(ImgToProperties.LABEL_HP),
                properties.get(ImgToProperties.LABEL_ENERGY),
                properties.get(ImgToProperties.LABEL_ATTACK),
                properties.get(ImgToProperties.LABEL_DEFENSE));
    }
}
