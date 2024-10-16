package com.cpe.springboot.cardPropertiesService.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class PropertiesTransactionDTO implements Serializable {
    private int idTransaction;
    private String imgUrl;
    private boolean isBase64;
}
