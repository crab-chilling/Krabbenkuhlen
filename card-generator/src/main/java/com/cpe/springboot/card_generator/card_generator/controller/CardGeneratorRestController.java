package com.cpe.springboot.card_generator.card_generator.controller;

import com.cpe.springboot.card_generator.card_generator.service.CardGeneratorService;
import com.cpe.springboot.dto.CardDTO;
import com.cpe.springboot.dto.AsyncResponseDTO;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class CardGeneratorRestController {

    private final CardGeneratorService cardGeneratorService;

    public CardGeneratorRestController(CardGeneratorService cardGeneratorService) {
        this.cardGeneratorService=cardGeneratorService;
    }

    @RequestMapping(method= RequestMethod.POST, value="/generate")
    public AsyncResponseDTO generate(@RequestBody CardDTO cardDTO) {
        this.cardGeneratorService.generateCard
    }
}
