package com.cpe.springboot.cardPropertiesService.service;

import com.cpe.springboot.cardPropertiesService.configuration.ActiveMQConfiguration;
import com.cpe.springboot.cardPropertiesService.dto.PropertiesDTO;
import com.cpe.springboot.cardPropertiesService.dto.PropertiesTransactionDTO;
import jakarta.jms.*;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.springframework.stereotype.Service;
import tp.cpe.ImgToProperties;

import java.lang.IllegalStateException;
import java.util.Map;

@Service
public class PropertiesService {

    public void publishTransactionIntoMQ(PropertiesTransactionDTO transactionDTO) {
        ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(ActiveMQConfiguration.BROKER_URL);
        try(Connection connection = connectionFactory.createConnection()){
            connection.start();
            Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
            Destination destination = session.createQueue(ActiveMQConfiguration.QUEUE_NAME);
            MessageProducer producer = session.createProducer(destination);
            producer.send(session.createObjectMessage(transactionDTO));
        }catch(JMSException e){
            throw new IllegalStateException(e.getMessage(), e);
        }

    }

    public PropertiesDTO getPropertiesFromImgUrl(PropertiesTransactionDTO transactionDTO){
        Map<String, Float> properties = ImgToProperties.getPropertiesFromImg(transactionDTO.getImgUrl(), 100f, 5, 0.2f, transactionDTO.isBase64());
        return new PropertiesDTO(properties.get(ImgToProperties.LABEL_HP),
                properties.get(ImgToProperties.LABEL_ENERGY),
                properties.get(ImgToProperties.LABEL_ATTACK),
                properties.get(ImgToProperties.LABEL_DEFENSE));
    }
}
