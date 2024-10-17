package com.cpe.springboot.cardPropertiesService.service;

import com.cpe.springboot.cardPropertiesService.ActiveMQListener;
import com.cpe.springboot.cardPropertiesService.configuration.ActiveMQConfiguration;
import com.cpe.springboot.cardPropertiesService.dto.PropertiesDTO;
import com.cpe.springboot.cardPropertiesService.dto.PropertiesTransactionDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.jms.JMSException;
import jakarta.jms.Message;
import jakarta.jms.TextMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;
import tp.cpe.ImgToProperties;

import java.util.Map;

@Service
@AllArgsConstructor
@Slf4j
public class PropertiesService {

    JmsTemplate jmsTemplate;

    ObjectMapper objectMapper;

    public void publishTransactionIntoMQ(PropertiesTransactionDTO transactionDTO) {
        log.info("[PropertiesService] Send message :" + transactionDTO);
        //jmsTemplate.convertAndSend(ActiveMQConfiguration.PROPERTIES_OWN_QUEUE, transactionDTO);
        jmsTemplate.send(ActiveMQConfiguration.PROPERTIES_OWN_QUEUE, s -> {
            try {
                TextMessage msg = s.createTextMessage(objectMapper.writeValueAsString(transactionDTO));
                msg.setStringProperty("Content-Type", "application/json");
                msg.setStringProperty("ObjectType", transactionDTO.getClass().getCanonicalName());

                return msg;
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        });
        log.info("[PropertiesService] Message sent");

    }

    public void startActiveMqListener(){
        Thread thread = new Thread(new ActiveMQListener(this, jmsTemplate));
        thread.start();
    }

    @JmsListener(destination = "tasks", containerFactory = "queueConnectionFactory")
    public PropertiesTransactionDTO receiveTransactionMessage() throws JMSException, JsonProcessingException {
        log.info("[PropertiesService] " + jmsTemplate.receive(ActiveMQConfiguration.PROPERTIES_OWN_QUEUE).getBody(String.class));
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
