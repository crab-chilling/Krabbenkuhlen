package com.cpe.springboot.card_generator.card_generator.controller;

import com.cpe.springboot.dto.requests.CardGeneratorTransactionDTO;

import com.cpe.springboot.card_generator.card_generator.service.CardGeneratorService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class CardGeneratorRestController {

    private final CardGeneratorService cardGeneratorService;

    public CardGeneratorRestController(CardGeneratorService cardGeneratorService) {
        this.cardGeneratorService=cardGeneratorService;
    }

    @RequestMapping(method= RequestMethod.POST, value="/generate")
    public HttpStatus generateCard(@RequestBody CardGeneratorTransactionDTO cardGeneratorTransactionDTO)
    {
        return this.cardGeneratorService.generateCard(cardGeneratorTransactionDTO);
    }
}
