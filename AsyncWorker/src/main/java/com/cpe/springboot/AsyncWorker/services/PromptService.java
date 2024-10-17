package com.cpe.springboot.AsyncWorker.services;

import com.cpe.springboot.AsyncWorker.models.ImageRequest;
import com.cpe.springboot.AsyncWorker.models.PromptDto;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Slf4j
@Service
public class PromptService {

    @Value("${api.url.ollama}")
    private String apiUrl;

    private final WebClient client;

    public PromptService() {
        HttpClient httpClient =
                HttpClient.create()
                        .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 300000)
                        .responseTimeout(Duration.ofMillis(300000))
                        .doOnConnected(conn -> conn.addHandlerLast(new ReadTimeoutHandler(300000)));

        this.client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }


    public void createPrompt(PromptDto forQueue) {
        client.post()
                .uri(this.apiUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .body(forQueue, PromptDto.class)
                .retrieve()
                // todo:
                .bodyToMono(String.class)
                .subscribe(res -> {
                    log.info("Publishing to queue");
                    // todo publish queu
                }, error -> {
                    log.error("We are cooked");
                    // todo publish error
                });

    }

}
