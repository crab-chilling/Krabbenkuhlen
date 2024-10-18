package com.cpe.springboot.AsyncWorker.controllers;

import com.cpe.springboot.AsyncWorker.models.GenerationRequest;
import com.cpe.springboot.AsyncWorker.services.ImageService;
import com.cpe.springboot.AsyncWorker.services.PromptService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class AsyncJobController {

    private ImageService imageService;
    private PromptService promptService;

    @PostMapping("/generate")
    public HttpStatus generateImage(@RequestBody GenerationRequest request) {
        try {
            imageService.createImage(request.getImagePrompt());
            promptService.createPrompt(request.getDescriptionPrompt());
        } catch (Exception e) {
            e.printStackTrace();
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return HttpStatus.OK;
    }
}
