package com.cpe.springboot.AsyncWorker.controllers;

import com.cpe.springboot.AsyncWorker.services.ImageService;
import com.cpe.springboot.AsyncWorker.services.PromptService;
import com.cpe.springboot.dto.requests.DescriptionTransactionDTO;
import com.cpe.springboot.dto.requests.ImageTransactionDTO;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AsyncJobController {

    private final ImageService imageService;
    private final PromptService promptService;

    public AsyncJobController(ImageService imageService, PromptService promptService) {
        this.imageService = imageService;
        this.promptService = promptService;
    }

    @PostMapping("/image")
    public HttpStatus generateImage(@RequestBody ImageTransactionDTO iamgeTransactionDTO) {
        this.imageService.createImage(iamgeTransactionDTO);
        return HttpStatus.OK;
    }

    @PostMapping("/prompt")
    public HttpStatus promptImage(@RequestBody DescriptionTransactionDTO descriptionTransactionDTO) {
        this.promptService.createDesc(descriptionTransactionDTO);
        return HttpStatus.OK;
    }
}
