package com.cpe.springboot.AsyncWorker.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class PromptDTOResponse implements Serializable {
    @JsonProperty("response")
    private String prompt;
    private int transactionId;
}
