package com.cpe.springboot.cardPropertiesService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.event.EventListener;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.jms.core.JmsTemplate;

@ComponentScan({"com.cpe.springboot.activemq","com.cpe.springboot.cardPropertiesService"})
@SpringBootApplication
public class CardPropertiesServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CardPropertiesServiceApplication.class, args);
	}

}
