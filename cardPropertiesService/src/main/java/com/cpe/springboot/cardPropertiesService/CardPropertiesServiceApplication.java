package com.cpe.springboot.cardPropertiesService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.jms.core.JmsTemplate;

@SpringBootApplication
public class CardPropertiesServiceApplication {

	@Autowired
	JmsTemplate jmsTemplate;

	@EventListener(ApplicationReadyEvent.class)
	public void doInitAfterStartup() {
		//enable to be in topic mode! to do at start
		jmsTemplate.setPubSubDomain(true);
	}


	public static void main(String[] args) {
		SpringApplication.run(CardPropertiesServiceApplication.class, args);
	}

}
