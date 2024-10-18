package com.cpe.springboot.AsyncWorker.services;

import com.cpe.springboot.AsyncWorker.models.DescriptionResponse;
import com.cpe.springboot.AsyncWorker.models.PromptRequest;
import com.google.gson.Gson;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Slf4j
@Service
public class PromptService {

    @Value("${api.url.llama}")
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


    public void createPrompt(String prompt) {
        PromptRequest forQueue = new PromptRequest("qwen2:0.5b", prompt, false);

        client.post()
                .uri(this.apiUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(forQueue)
                .retrieve()
                .bodyToMono(String.class)
                .subscribe(res -> {
                    log.info("Publishing to queue");
                    Gson content = new Gson();
                    DescriptionResponse desc = content.fromJson(res, DescriptionResponse.class);
                    log.info("{}", desc);
                }, error -> {
                    log.error("We are cooked");
                    // todo publish error
                    error.printStackTrace();
                });
    }

}
