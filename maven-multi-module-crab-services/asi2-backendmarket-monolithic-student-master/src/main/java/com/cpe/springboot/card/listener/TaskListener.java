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
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Optional;

import static com.cpe.springboot.common.Constants.ENDPOINT_SEND_EMAIL;

@Slf4j
@Component
public class TaskListener extends AbstractJmsListener {

    private final UserRepository userRepository;
    private final WebClient.Builder webClientBuilder;
    private final CardModelRepository cardRepository;

    public TaskListener(ObjectMapper objectMapper, ActiveMQ activeMQ,
                        UserRepository userRepository, WebClient.Builder webClientBuilder, CardModelRepository cardRepository) {
        super(objectMapper, activeMQ);
        this.userRepository = userRepository;
        this.webClientBuilder = webClientBuilder;
        this.cardRepository = cardRepository;
    }

    @Override
    @JmsListener(destination = "createdcard", containerFactory = "queueConnectionFactory")
    public void traitementService(TextMessage textMessage) throws JsonProcessingException, JMSException, ClassNotFoundException {

        GenericMQDTO object = (GenericMQDTO) this.messageToObject(textMessage);

        if(object instanceof CreatedCardDTO createdCardDTO) {

            Optional<UserModel> o_userModel = userRepository.findById(createdCardDTO.userId);
            if (o_userModel.isEmpty()) {
                return;
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
                    .uri(ENDPOINT_SEND_EMAIL)
                    .bodyValue(new EmailTransactionDTO(user.getEmail(), "Your card has been generated", "Hello,\nYour card has been generated !"))
                    .retrieve()
                    .toBodilessEntity()
                    .block();
        }
    }
}
