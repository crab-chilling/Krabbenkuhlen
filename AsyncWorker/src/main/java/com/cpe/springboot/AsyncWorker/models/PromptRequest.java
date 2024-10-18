package com.cpe.springboot.AsyncWorker.models;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class PromptRequest implements Serializable {
    private String model;
    private String prompt;
    private boolean stream;
}
