package com.cpe.springboot.dto;

import com.cpe.springboot.dto.enums.Status;

public class AsyncResponseDTO {
    private Status status;

    private String message;

    public AsyncResponseDTO(Status status, String message) {
        this.status = status;
        this.message = message;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
