package com.cpe.springboot.cardPropertiesService.dto;

import com.cpe.springboot.dto.GenericMQDTO;
import lombok.Data;

import java.io.Serializable;

@Data
public class PropertiesTransactionDTO extends GenericMQDTO {
    private String imgUrl;
    private boolean isBase64;
}
