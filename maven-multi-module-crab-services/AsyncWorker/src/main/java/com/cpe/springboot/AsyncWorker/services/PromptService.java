package com.cpe.springboot.AsyncWorker.services;

import com.cpe.springboot.activemq.ActiveMQ;
import com.cpe.springboot.dto.queues.DescriptionDTO;
import com.cpe.springboot.dto.requests.DescriptionTransactionDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static com.cpe.springboot.AsyncWorker.common.Constants.ACTIVEMQ_QUEUE_ASYNCWORKER_WORKFLOW;

@Slf4j
@Service
public class PromptService {

    private final ActiveMQ activeMQ;

    public PromptService(ActiveMQ activeMQ) {
        this.activeMQ = activeMQ;
    }

    public void createDesc(DescriptionTransactionDTO descriptionTransactionDTO) {
        log.info("[PromptService] Sending description to Ollama");
        DescriptionDTO descriptionDTO = new DescriptionDTO(descriptionTransactionDTO.getTransactionId(), descriptionTransactionDTO.getDescPrompt());
        activeMQ.publish(descriptionDTO, ACTIVEMQ_QUEUE_ASYNCWORKER_WORKFLOW);
    }
}
