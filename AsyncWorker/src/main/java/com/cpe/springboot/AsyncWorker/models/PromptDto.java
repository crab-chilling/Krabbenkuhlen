package com.cpe.springboot.AsyncWorker.models;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
public class PromptDto implements Serializable {
    private String model;
    private String prompt;
    private boolean stream;

    public PromptDto(String prompt) {
        this.model = "qwen2:0.5b";
        this.stream = false;
        this.prompt = prompt;
    }
}
