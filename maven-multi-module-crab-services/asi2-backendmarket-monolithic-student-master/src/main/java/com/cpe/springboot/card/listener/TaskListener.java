package com.cpe.springboot.card.listener;

import com.cpe.springboot.activemq.AbstractJmsListener;
import com.cpe.springboot.activemq.ActiveMQ;
import com.cpe.springboot.card.Controller.CardModelRepository;
import com.cpe.springboot.card.model.CardModel;
import com.cpe.springboot.dto.queues.CreatedCardDTO;
import com.cpe.springboot.dto.queues.GenericMQDTO;
import com.cpe.springboot.dto.requests.EmailTransactionDTO;
import com.cpe.springboot.user.controller.UserRepository;
import com.cpe.springboot.user.model.UserModel;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Optional;

@Slf4j
@Component
public class TaskListener extends AbstractJmsListener {

    private final static String URL_NOTIFICATION_SERVICE = "http://localhost:8091";
    private final static String ENDPOINT_SEND_EMAIL = "/send/mail";

    private UserRepository userRepository;
    private WebClient.Builder webClientBuilder;
    private CardModelRepository cardRepository;

    public TaskListener(ObjectMapper objectMapper, JmsTemplate jmsTemplate, ActiveMQ activeMQ,
                        UserRepository userRepository, WebClient.Builder webClientBuilder, CardModelRepository cardRepository) {
        super(objectMapper, jmsTemplate, activeMQ);
        this.userRepository = userRepository;
        this.webClientBuilder = webClientBuilder;
        this.cardRepository = cardRepository;
    }

    @Override
    public GenericMQDTO traitementService(Object object) {

        if(object instanceof CreatedCardDTO) {
            CreatedCardDTO createdCardDTO = (CreatedCardDTO) object;

            Optional<UserModel> o_userModel = userRepository.findById(createdCardDTO.userId);
            if (o_userModel.isEmpty()) {
                return null;
            }

            UserModel user = o_userModel.get();
            CardModel card = new CardModel("Jack l'éventreur", createdCardDTO.getDescription(), null, null, createdCardDTO.getEnergy(), createdCardDTO.getHp(),
                    createdCardDTO.getDefense(), createdCardDTO.getAttack(), createdCardDTO.getImageUrl(), createdCardDTO.getImageUrl(), createdCardDTO.getPrice());
            cardRepository.save(card);

            user.addCard(card);
            userRepository.save(user);
            log.info("User saved with new card");


            webClientBuilder.build()
                    .post()
                    .uri(URL_NOTIFICATION_SERVICE + ENDPOINT_SEND_EMAIL)
                    .bodyValue(new EmailTransactionDTO(user.getEmail(), "Your card has been generated", "Hello,\nYour card has been generated !"))
                    .retrieve()
                    .toBodilessEntity()
                    .block();
        }

        return null;
    }
}
