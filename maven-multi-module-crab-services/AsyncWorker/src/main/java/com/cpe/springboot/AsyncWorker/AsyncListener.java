package com.cpe.springboot.AsyncWorker;

import com.cpe.springboot.AsyncWorker.models.ImageDto;
import com.cpe.springboot.AsyncWorker.models.ImageRequest;
import com.cpe.springboot.AsyncWorker.models.PromptDto;
import com.cpe.springboot.AsyncWorker.models.PromptRequest;
import com.cpe.springboot.activemq.AbstractJmsListener;
import com.cpe.springboot.dto.queues.DescriptionDTO;
import com.cpe.springboot.dto.queues.GenericMQDTO;
import com.cpe.springboot.dto.queues.ImageDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Component
public class AsyncListener extends AbstractJmsListener {

    private final WebClient client;

    @Value("${api.url.ollama}")
    private String apiUrlOllama;

    @Value("${api.url.neural}")
    private String apiUrlNeural;

    public AsyncListener(ObjectMapper objectMapper, JmsTemplate jmsTemplate) {
        super(objectMapper, jmsTemplate);
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
    public GenericMQDTO traitementService(Object object) {
        if (object instanceof DescriptionDTO) {

            PromptRequest promptRequest = new PromptRequest(
                    ((DescriptionDTO)object).getDescription()
            );

            PromptDto promptDto = client.post()
                    .uri(this.apiUrlOllama)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Mono.just(promptRequest), PromptRequest.class)
                    .retrieve()
                    .bodyToMono(PromptDto.class)
                    .block();

            return new DescriptionDTO(
                    ((DescriptionDTO)object).getTransactionId(),
                    promptDto.getPrompt()
            );
        } else if (object instanceof ImageDTO) {
            ImageRequest imageRequest = new ImageRequest(
                    ((ImageDTO)object).getImgUrl(),
                    ""
            );
            ImageDto imageDTO = client.post()
                    .uri(this.apiUrlNeural)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Mono.just(imageRequest), ImageRequest.class)
                    .retrieve()
                    .bodyToMono(ImageDto.class)
                    .block();

            return new ImageDTO(
                    ((ImageDTO)object).getTransactionId(),
                    imageDTO.getUrl(),
                    false
            );
        }
        return null;
    }
}
