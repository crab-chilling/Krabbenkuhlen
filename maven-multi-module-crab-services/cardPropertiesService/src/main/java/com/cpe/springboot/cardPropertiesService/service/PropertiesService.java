package com.cpe.springboot.cardPropertiesService.service;

import com.cpe.springboot.activemq.ActiveMQ;
import com.cpe.springboot.dto.queues.ImageDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.jms.JMSException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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


    public com.cpe.springboot.dto.queues.PropertiesDTO getPropertiesFromImgUrl(ImageDTO imageDTO) throws JMSException, JsonProcessingException {
        Map<String, Float> properties = ImgToProperties.getPropertiesFromImg(imageDTO.getImgUrl(), 100f, 5, 0.2f, imageDTO.isBase64());
        return new com.cpe.springboot.dto.queues.PropertiesDTO(imageDTO.transactionId,
                properties.get(ImgToProperties.LABEL_HP),
                properties.get(ImgToProperties.LABEL_ENERGY),
                properties.get(ImgToProperties.LABEL_ATTACK),
                properties.get(ImgToProperties.LABEL_DEFENSE));
    }
}
