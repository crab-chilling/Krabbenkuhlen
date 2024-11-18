package com.cpe.springboot.AsyncWorker;

import com.cpe.springboot.AsyncWorker.models.ImageDTO;
import com.cpe.springboot.AsyncWorker.models.ImageRequest;
import com.cpe.springboot.AsyncWorker.models.PromptDTO;
import com.cpe.springboot.AsyncWorker.models.PromptRequest;
import com.cpe.springboot.activemq.AbstractJmsListener;
import com.cpe.springboot.activemq.ActiveMQ;
import com.cpe.springboot.dto.queues.DescriptionDTO;
import com.cpe.springboot.dto.queues.GenericMQDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

import static com.cpe.springboot.AsyncWorker.common.Constants.*;
import static com.cpe.springboot.common.Constants.ACTIVEMQ_QUEUE_TASK;

@Component
public class AsyncListener extends AbstractJmsListener {

    private final WebClient client;

    public AsyncListener(ObjectMapper objectMapper, ActiveMQ activeMQ) {
        super(objectMapper, activeMQ);
        HttpClient httpClient =
                HttpClient.create()
                        .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 300000)
                        .responseTimeout(Duration.ofMillis(300000))
                        .doOnConnected(conn -> conn.addHandlerLast(new ReadTimeoutHandler(300000)));

        this.client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }

    @Override
    @JmsListener(destination = "asyncworker", containerFactory = "queueConnectionFactory")
    public void traitementService(TextMessage textMessage) throws JMSException, JsonProcessingException {

        Object object = this.messageToObject(textMessage);
        GenericMQDTO responseDTO = null;

        if (object instanceof DescriptionDTO descriptionDTOQueue) {

            PromptRequest promptRequest = new PromptRequest(
                    descriptionDTOQueue.getDescription()
            );

            PromptDTO promptDto = client.post()
                    .uri(ENDPOINT_GENERATE_DESCRIPTION)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Mono.just(promptRequest), PromptRequest.class)
                    .retrieve()
                    .bodyToMono(PromptDTO.class)
                    .block();

            responseDTO = new DescriptionDTO(
                    descriptionDTOQueue.getTransactionId(),
                    promptDto.getPrompt()
            );
        } else if (object instanceof com.cpe.springboot.dto.queues.ImageDTO imageDTOQueue) {
            ImageRequest imageRequest = new ImageRequest(
                    imageDTOQueue.getImgUrl(),
                    ""
            );
            ImageDTO imageDto = client.post()
                    .uri(ENDPOINT_GENERATE_IMAGE)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Mono.just(imageRequest), ImageRequest.class)
                    .retrieve()
                    .bodyToMono(ImageDTO.class)
                    .block();

            responseDTO = new com.cpe.springboot.dto.queues.ImageDTO(
                    imageDTOQueue.getTransactionId(),
                    imageDto.getUrl(),
                    false
            );
        }

        this.activeMQ.publish(responseDTO, ACTIVEMQ_QUEUE_TASK);
    }
}
