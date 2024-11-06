package com.cpe.springboot.AsyncWorker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan({"com.cpe.springboot.activemq","com.cpe.springboot.AsyncWorker"})
@SpringBootApplication
public class AsyncWorkerApplication {

	public static void main(String[] args) {
		SpringApplication.run(AsyncWorkerApplication.class, args);
	}

}
