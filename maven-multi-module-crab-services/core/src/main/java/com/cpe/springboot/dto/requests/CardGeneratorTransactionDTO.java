package com.cpe.springboot.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class CardGeneratorTransactionDTO {

    private Integer userId;

    private String imagePrompt;

    private String descPrompt;
}
