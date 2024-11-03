package com.cpe.springboot.notifications_service.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class EmailDTO {
    private String emailDestination;
    private String emailSubject;
    private String emailText;
}
