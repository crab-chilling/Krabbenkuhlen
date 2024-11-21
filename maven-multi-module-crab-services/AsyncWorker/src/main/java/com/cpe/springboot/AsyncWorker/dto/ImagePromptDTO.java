package com.cpe.springboot.AsyncWorker.dto;

import com.cpe.springboot.dto.queues.GenericMQDTO;

public class ImagePromptDTO extends GenericMQDTO {

    private String prompt;

    public ImagePromptDTO(int transactionId, String prompt) {
        super(transactionId);
        this.prompt = prompt;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }
}
