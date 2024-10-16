package com.cpe.springboot.cardPropertiesService.controller;

import com.cpe.springboot.cardPropertiesService.dto.PropertiesTransactionDTO;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PropertiesController {

    @PostMapping
    public void publishTransaction(@RequestBody PropertiesTransactionDTO transactionDTO){

    }
}
