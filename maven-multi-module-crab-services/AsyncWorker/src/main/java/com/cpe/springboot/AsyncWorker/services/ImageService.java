package com.cpe.springboot.AsyncWorker.services;

import com.cpe.springboot.AsyncWorker.AsyncListener;
import com.cpe.springboot.AsyncWorker.models.ImageDto;
import com.cpe.springboot.AsyncWorker.models.ImageRequest;
import com.cpe.springboot.AsyncWorker.models.PromptDto;
import com.cpe.springboot.AsyncWorker.models.PromptRequest;
import com.cpe.springboot.activemq.ActiveMQ;
import com.cpe.springboot.dto.queues.DescriptionDTO;
import com.cpe.springboot.dto.queues.GenericMQDTO;
import com.cpe.springboot.dto.queues.ImageDTO;
import com.cpe.springboot.dto.requests.DescriptionTransactionDTO;
import com.cpe.springboot.dto.requests.ImageTransactionDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Slf4j
@Service
public class ImageService {

    @Value("${api.url.neural}")
    private String apiUrl;

    private final WebClient client;
    private final ActiveMQ activeMQ;
    private final AsyncListener asyncListener;


    public ImageService(ActiveMQ activeMQ, AsyncListener asyncListener) {
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

    public void createImage(ImageTransactionDTO imageTransactionDTO) {
        ImageDTO imageDto = new ImageDTO(imageTransactionDTO.getTransactionId(), imageTransactionDTO.getImagePrompt(), true);
        activeMQ.publish(imageDto, "asyncworker");
    }

    @JmsListener(destination = "asyncworker", containerFactory = "queueConnectionFactory")
    void consumeOwnQueue(TextMessage message) throws Exception {
        this.asyncListener.doReceive(message, "asyncworker");
    }

}
