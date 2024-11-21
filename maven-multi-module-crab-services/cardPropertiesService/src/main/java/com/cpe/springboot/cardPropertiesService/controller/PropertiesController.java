package com.cpe.springboot.cardPropertiesService.controller;

import com.cpe.springboot.activemq.ActiveMQ;
import com.cpe.springboot.cardPropertiesService.service.PropertiesService;
import com.cpe.springboot.dto.queues.ImageDTO;
import com.cpe.springboot.dto.requests.PropertiesTransactionDTO;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import static com.cpe.springboot.cardPropertiesService.common.Constants.ACTIVEMQ_QUEUE_PROPERTIES_WORKFLOW;

@RestController
@AllArgsConstructor
public class PropertiesController {

    private ActiveMQ activeMQ;

    @RequestMapping(method = RequestMethod.POST, value = "/properties")
    public void publishTransaction(@RequestBody PropertiesTransactionDTO transactionDTO){
        activeMQ.publish(new ImageDTO(transactionDTO.getTransactionId(), transactionDTO.getImgUrl(), transactionDTO.isBase64()), ACTIVEMQ_QUEUE_PROPERTIES_WORKFLOW);
    }
}
