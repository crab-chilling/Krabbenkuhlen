package com.cpe.springboot.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class DescriptionTransactionDTO {

    private Integer transactionId;

    private String descPrompt;
}
