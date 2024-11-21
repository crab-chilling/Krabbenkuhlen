package com.cpe.springboot.AsyncWorker;

import com.cpe.springboot.AsyncWorker.dto.*;
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
    public void traitementService(TextMessage textMessage) throws JMSException, JsonProcessingException, ClassNotFoundException {

        GenericMQDTO object = (GenericMQDTO) this.messageToObject(textMessage);
        GenericMQDTO responseDTO = null;

        if (object instanceof DescPromptDTO descPromptDTO) {

            PromptRequest promptRequest = new PromptRequest(
                    descPromptDTO.getDescPrompt()
            );

            PromptDTOResponse promptDto = client.post()
                    .uri(ENDPOINT_GENERATE_DESCRIPTION)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Mono.just(promptRequest), PromptRequest.class)
                    .retrieve()
                    .bodyToMono(PromptDTOResponse.class)
                    .block();

            responseDTO = new DescriptionDTO(
                    descPromptDTO.getTransactionId(),
                    promptDto.getPrompt()
            );
        } else if (object instanceof ImagePromptDTO imagePromptDTO) {
            ImageRequest imageRequest = new ImageRequest(
                    imagePromptDTO.getPrompt(),
                    ""
            );
            ImageDTOResponse imageDto = client.post()
                    .uri(ENDPOINT_GENERATE_IMAGE)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Mono.just(imageRequest), ImageRequest.class)
                    .retrieve()
                    .bodyToMono(ImageDTOResponse.class)
                    .block();

            responseDTO = new com.cpe.springboot.dto.queues.ImageDTO(
                    imagePromptDTO.getTransactionId(),
                    imageDto.getUrl(),
                    false
            );
        }

        this.activeMQ.publish(responseDTO, ACTIVEMQ_QUEUE_TASK);
    }
}
