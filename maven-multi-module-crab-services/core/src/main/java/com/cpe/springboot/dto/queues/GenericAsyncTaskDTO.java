package com.cpe.springboot.dto.queues;

import lombok.AllArgsConstructor;
import lombok.Data;

public abstract class GenericAsyncTaskDTO {

    private Integer transactionId;

    public GenericAsyncTaskDTO(Integer transactionId) {
        this.transactionId = transactionId;
    }

    public Integer getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Integer transactionId) {
        this.transactionId = transactionId;
    }
}
