package com.cpe.springboot.AsyncWorker.models;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class GenerationRequest implements Serializable {
    private String imagePrompt;
    private String descriptionPrompt;
}
