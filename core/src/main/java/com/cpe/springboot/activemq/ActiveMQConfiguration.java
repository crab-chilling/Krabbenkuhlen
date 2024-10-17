package com.cpe.springboot.activemq;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.core.JmsTemplate;

@Configuration
public class ActiveMQConfiguration {
    @Bean
    ActiveMQ activeMQ(ObjectMapper objectMapper, JmsTemplate jmsTemplate) {
        return new ActiveMQ(jmsTemplate, objectMapper);
    }
}
