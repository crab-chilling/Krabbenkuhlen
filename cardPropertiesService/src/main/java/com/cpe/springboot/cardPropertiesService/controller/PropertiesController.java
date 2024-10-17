package com.cpe.springboot.cardPropertiesService.controller;

import com.cpe.springboot.cardPropertiesService.dto.PropertiesTransactionDTO;
import com.cpe.springboot.cardPropertiesService.service.PropertiesService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
public class PropertiesController {

    private PropertiesService service;

    @RequestMapping(method = RequestMethod.POST, value = "/properties")
    public void publishTransaction(@RequestBody PropertiesTransactionDTO transactionDTO){
        service.startActiveMqListener();
        service.publishTransactionIntoMQ(transactionDTO);
    }
}
