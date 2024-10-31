package com.cpe.springboot.card_generator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan({"com.cpe.springboot.activemq", "com.cpe.springboot.card_generator"})
@SpringBootApplication
public class CardGeneratorApplication {

	public static void main(String[] args) {
		SpringApplication.run(CardGeneratorApplication.class, args);
	}

}
