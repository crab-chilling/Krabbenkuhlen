package com.cpe.springboot.AsyncWorker.services;

import com.cpe.springboot.AsyncWorker.dto.ImagePromptDTO;
import com.cpe.springboot.activemq.ActiveMQ;
import com.cpe.springboot.dto.queues.ImageDTO;
import com.cpe.springboot.dto.requests.ImageTransactionDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static com.cpe.springboot.AsyncWorker.common.Constants.ACTIVEMQ_QUEUE_ASYNCWORKER_WORKFLOW;

@Slf4j
@Service
public class ImageService {

    private final ActiveMQ activeMQ;

    public ImageService(ActiveMQ activeMQ) {
        this.activeMQ = activeMQ;
    }

    public void createImage(ImageTransactionDTO imageTransactionDTO) {
        log.info("Creating image");
        ImagePromptDTO imagePromptDTO = new ImagePromptDTO(imageTransactionDTO.getTransactionId(), imageTransactionDTO.getImagePrompt());
        activeMQ.publish(imagePromptDTO, ACTIVEMQ_QUEUE_ASYNCWORKER_WORKFLOW);
    }
}
