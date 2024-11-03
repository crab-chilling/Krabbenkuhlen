package com.cpe.springboot.notifications_service.controller;

import com.cpe.springboot.notifications_service.DTO.EmailDTO;
import com.cpe.springboot.notifications_service.service.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@AllArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @PostMapping("/send/mail")
    public void sendEmail(@RequestBody EmailDTO emailContent){
        service.sendEmail(emailContent.getEmailDestination(), emailContent.getEmailSubject(), emailContent.getEmailText());
    }
}
