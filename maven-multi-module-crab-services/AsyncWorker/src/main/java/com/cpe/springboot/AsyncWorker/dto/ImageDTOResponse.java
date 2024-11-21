package com.cpe.springboot.AsyncWorker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class ImageDTOResponse implements Serializable {
    private String url;
    private String base64;
}
