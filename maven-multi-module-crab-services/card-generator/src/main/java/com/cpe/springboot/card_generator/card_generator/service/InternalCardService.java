package com.cpe.springboot.card_generator.card_generator.service;

import com.cpe.springboot.card_generator.card_generator.model.Transaction;
import com.cpe.springboot.card_generator.card_generator.repository.TransactionRepository;
import com.cpe.springboot.dto.queues.DescriptionDTO;
import com.cpe.springboot.dto.queues.ImageDTO;
import com.cpe.springboot.dto.queues.PropertiesDTO;
import com.cpe.springboot.dto.requests.PropertiesTransactionDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Optional;

import static com.cpe.springboot.card_generator.card_generator.common.Constants.ENDPOINT_PROPERTIES;
import static com.cpe.springboot.card_generator.card_generator.common.Constants.URL_PROPERTIES_SERVICE;

@Service
@Slf4j
@AllArgsConstructor
public class InternalCardService {

    private TransactionRepository repository;
    private ObjectMapper objectMapper;
    private final WebClient.Builder webClientBuilder;

    public Transaction proceedImageMessage(ImageDTO imageDTO) {
        log.info("Proceeding image message for transaction {}.", imageDTO.getTransactionId());
        Optional<Transaction> o_transaction = repository.findById(imageDTO.getTransactionId());
        if (o_transaction.isEmpty()) {
            log.info("Transaction {} not found.", imageDTO.getTransactionId());
            return null;
        }

        Transaction transaction = o_transaction.get();
        transaction.setImageUrl(imageDTO.getImgUrl());
        transaction.setBase64(imageDTO.isBase64());
        transaction = repository.saveAndFlush(transaction);

        log.info("Sending properties request for transaction {}.", imageDTO.getTransactionId());

        ResponseEntity asyncResponseDTO = webClientBuilder.build()
                .post()
                .uri(URL_PROPERTIES_SERVICE + ENDPOINT_PROPERTIES)
                .bodyValue(new PropertiesTransactionDTO(transaction.getId(), imageDTO.getImgUrl(), imageDTO.isBase64()))
                .retrieve()
                .toBodilessEntity()
                .block();

        if (asyncResponseDTO == null || asyncResponseDTO.getStatusCode().isError()){
            log.error("3 An error occured while trying to generate card properties : {}.", asyncResponseDTO);
            return null;
        }

        return transaction;
    }

    public Transaction proceedDescriptionMessage(DescriptionDTO descriptionDTO) {
        log.info("Proceeding description message for transaction {}.", descriptionDTO.getTransactionId());
        Optional<Transaction> o_transaction = repository.findById(descriptionDTO.getTransactionId());
        if (o_transaction.isEmpty()) {
            return null;
        }

        Transaction transaction = o_transaction.get();
        transaction.setDescription(descriptionDTO.getDescription());
        transaction = repository.saveAndFlush(transaction);

        return transaction;
    }

    public boolean isCardComplete(Transaction transaction) {
        if (transaction.getImageUrl() != null && transaction.getDescription() != null && transaction.getHp() != 0 && transaction.getEnergy() != 0 && transaction.getAttack() != 0 && transaction.getDefense() != 0) {
            return true;
        }
        return false;
    }

    public Transaction proceedPropertiesMessage(PropertiesDTO propertiesDTO) {
        log.info("Proceeding properties message for transaction {}.", propertiesDTO.getTransactionId());
        Optional<Transaction> o_transaction = repository.findById(propertiesDTO.getTransactionId());
        if (o_transaction.isEmpty()) {
            return null;
        }

        Transaction transaction = o_transaction.get();
        transaction.setHp(propertiesDTO.getHp());
        transaction.setEnergy(propertiesDTO.getEnergy());
        transaction.setAttack(propertiesDTO.getAttack());
        transaction.setDefense(propertiesDTO.getDefense());
        transaction = repository.saveAndFlush(transaction);

        return transaction;
    }
}
