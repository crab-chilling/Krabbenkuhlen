package com.cpe.springboot.AsyncWorker.services;

import com.cpe.springboot.AsyncWorker.models.ImageRequest;
import com.cpe.springboot.AsyncWorker.models.ImageResponse;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Slf4j
@Service
public class ImageService {

    @Value("${api.url.neural}")
    private String apiUrl;

    private final WebClient client;

    public ImageService() {
        HttpClient httpClient =
                HttpClient.create()
                        .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 300000)
                        .responseTimeout(Duration.ofMillis(300000))
                        .doOnConnected(conn -> conn.addHandlerLast(new ReadTimeoutHandler(300000)));

        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(clientCodecConfigurer ->  clientCodecConfigurer
                        .defaultCodecs()
                        .maxInMemorySize(32 * 1024 * 1024)) // 32 MB
                .build();

        this.client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .exchangeStrategies(strategies)
                .build();
    }

    public void createImage(String imgRequest) {
        ImageRequest forQueue = new ImageRequest(imgRequest, "");

        client.post()
                .uri(this.apiUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(forQueue)
                .retrieve()
                .bodyToMono(ImageResponse.class)
                .subscribe(res -> {
                    log.info("Publishing to queue");
                    // todo publish queu
                    log.info("{}", res);
                }, error -> {
                    log.error("We are cooked");
                    // todo publish error
                    error.printStackTrace();
                });
    }

}
