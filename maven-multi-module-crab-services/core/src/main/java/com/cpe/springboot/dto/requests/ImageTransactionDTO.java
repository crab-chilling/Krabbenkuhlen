package com.cpe.springboot.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ImageTransactionDTO {

    private Integer transactionId;

    private String imagePrompt;
}
