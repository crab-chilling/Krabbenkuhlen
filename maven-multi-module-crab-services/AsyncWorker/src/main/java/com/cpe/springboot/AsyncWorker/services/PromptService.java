package com.cpe.springboot.AsyncWorker.services;

import com.cpe.springboot.AsyncWorker.AsyncListener;
import com.cpe.springboot.AsyncWorker.models.PromptRequest;
import com.cpe.springboot.AsyncWorker.models.PromptDto;
import com.cpe.springboot.activemq.ActiveMQ;
import com.cpe.springboot.dto.queues.DescriptionDTO;
import com.cpe.springboot.dto.requests.DescriptionTransactionDTO;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import jakarta.jms.TextMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Slf4j
@Service
public class PromptService {

    @Value("${api.url.ollama}")
    private String apiUrl;

    private final WebClient client;
    private final ActiveMQ activeMQ;
    private final AsyncListener asyncListener;

    public PromptService(ActiveMQ activeMQ, AsyncListener asyncListener) {
        HttpClient httpClient =
                HttpClient.create()
                        .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 300000)
                        .responseTimeout(Duration.ofMillis(300000))
                        .doOnConnected(conn -> conn.addHandlerLast(new ReadTimeoutHandler(300000)));

        this.client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
        this.activeMQ = activeMQ;
        this.asyncListener = asyncListener;
    }

    public void createDesc(DescriptionTransactionDTO descriptionTransactionDTO) {
        DescriptionDTO descriptionDTO = new DescriptionDTO(descriptionTransactionDTO.getTransactionId(), descriptionTransactionDTO.getDescPrompt());
        activeMQ.publish(descriptionDTO, "asyncworker");
    }


    @JmsListener(destination = "asyncworker", containerFactory = "queueConnectionFactory")
    void consumeOwnQueue(TextMessage message) throws Exception {
        this.asyncListener.doReceive(message, "asyncworker");
    }

}
