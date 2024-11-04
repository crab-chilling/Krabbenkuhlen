package com.cpe.springboot.cardPropertiesService.service;

import com.cpe.springboot.activemq.ActiveMQ;
import com.cpe.springboot.cardPropertiesService.PropertiesListener;
import com.cpe.springboot.cardPropertiesService.configuration.ActiveMQConfiguration;
import com.cpe.springboot.dto.queues.ImageDTO;
import com.cpe.springboot.dto.queues.PropertiesDTO;
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

    public void publish(com.cpe.springboot.dto.requests.PropertiesTransactionDTO transactionDTO) {
        ImageDTO imageDTO = new ImageDTO(transactionDTO.getTransactionId(), transactionDTO.getImgUrl(), transactionDTO.isBase64());
        activeMQ.publish(imageDTO, ActiveMQConfiguration.PROPERTIES_OWN_QUEUE);
    }

    public void startActiveMqListener(){
        activeMQ.startListener(new PropertiesListener(this, jmsTemplate));
    }

    @JmsListener(destination = "properties", containerFactory = "queueConnectionFactory")
    public ImageDTO receiveTransactionMessage() throws JMSException, JsonProcessingException {
        log.info("Receiving message from properties queue");
        String message = jmsTemplate.receive(ActiveMQConfiguration.PROPERTIES_OWN_QUEUE).getBody(String.class);
        log.info("Message received from properties queue: {}", message);
        if(message != null){
            ImageDTO dto = objectMapper.readValue(message, ImageDTO.class);
            return dto;
        }else {
            return null;
        }
    }

    public com.cpe.springboot.dto.queues.PropertiesDTO getPropertiesFromImgUrl() throws JMSException, JsonProcessingException {
        log.info("Getting properties from image");
        ImageDTO imageDTO = receiveTransactionMessage();
        log.info("Image received: {}", imageDTO);
        if(imageDTO == null){
            return null;
        }
        Map<String, Float> properties = ImgToProperties.getPropertiesFromImg(imageDTO.getImgUrl(), 100f, 5, 0.2f, imageDTO.isBase64());
        return new com.cpe.springboot.dto.queues.PropertiesDTO(imageDTO.transactionId,
                properties.get(ImgToProperties.LABEL_HP),
                properties.get(ImgToProperties.LABEL_ENERGY),
                properties.get(ImgToProperties.LABEL_ATTACK),
                properties.get(ImgToProperties.LABEL_DEFENSE));
    }
}
