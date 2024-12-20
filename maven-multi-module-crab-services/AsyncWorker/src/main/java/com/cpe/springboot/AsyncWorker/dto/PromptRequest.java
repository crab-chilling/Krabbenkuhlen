package com.cpe.springboot.AsyncWorker.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class PromptRequest implements Serializable {
    private String model;
    private String prompt;
    private boolean stream;

    public PromptRequest(String prompt) {
        this.model = "qwen2:0.5b";
        this.stream = false;
        this.prompt = prompt;
    }
}
