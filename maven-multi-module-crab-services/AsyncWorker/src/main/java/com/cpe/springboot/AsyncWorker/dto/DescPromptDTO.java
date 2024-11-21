package com.cpe.springboot.AsyncWorker.dto;

import com.cpe.springboot.dto.queues.GenericMQDTO;

public class DescPromptDTO extends GenericMQDTO {

    private String descPrompt;

    public DescPromptDTO(int transactionId, String descPrompt) {
        super(transactionId);
        this.descPrompt = descPrompt;
    }

    public String getDescPrompt() {
        return descPrompt;
    }

    public void setDescPrompt(String descPrompt) {
        this.descPrompt = descPrompt;
    }
}
