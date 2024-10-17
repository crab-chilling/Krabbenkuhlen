package com.cpe.springboot.AsyncWorker.controllers;

import com.cpe.springboot.AsyncWorker.models.ImageDto;
import com.cpe.springboot.AsyncWorker.models.PromptDto;
import com.cpe.springboot.AsyncWorker.services.ImageService;
import com.cpe.springboot.AsyncWorker.services.PromptService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class AsyncJobController {

    private ImageService imageService;
    private PromptService promptService;

    @GetMapping("/")
    public String index() {
        return "Hello World";
    }


    @PostMapping("/image")
    public HttpStatus generateImage(@RequestBody ImageDto imageRequest) {
        try {
            imageService.createImage(imageRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return HttpStatus.OK;
    }

    @PostMapping("/prompt")
    public HttpStatus promptImage(@RequestBody PromptDto promptRequest) {
        try {
            promptService.createPrompt(promptRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return HttpStatus.OK;
    }
}
