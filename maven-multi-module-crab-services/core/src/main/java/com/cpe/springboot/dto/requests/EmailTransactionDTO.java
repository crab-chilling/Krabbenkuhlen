package com.cpe.springboot.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class EmailTransactionDTO {
    private String emailDestination;
    private String emailSubject;
    private String emailText;
}
