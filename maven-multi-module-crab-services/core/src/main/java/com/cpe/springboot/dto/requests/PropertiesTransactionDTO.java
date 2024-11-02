package com.cpe.springboot.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class PropertiesTransactionDTO {

    private Integer transactionId;

    private String imgUrl;

    private boolean isBase64;
}
