package com.cpe.springboot.AsyncWorker.models;

import lombok.AllArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
public class PromptDto implements Serializable {
    private final static String model = "qwen2:0.5b";
    private String prompt;
    private final static boolean stream = false;
}
