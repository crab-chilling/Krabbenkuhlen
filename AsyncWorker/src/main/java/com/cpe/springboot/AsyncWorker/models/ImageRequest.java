package com.cpe.springboot.AsyncWorker.models;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class ImageRequest implements Serializable {
    private String promptTxt;
    private String negativePromptTxt;
}
