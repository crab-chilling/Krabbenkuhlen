package com.cpe.springboot.dto.queues;

import java.io.Serializable;

public abstract class GenericMQDTO implements Serializable {

    public Integer transactionId;

    public GenericMQDTO(){}

    public GenericMQDTO(Integer transactionId) {
        this.transactionId = transactionId;
    }

    public Integer getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Integer transactionId) {
        this.transactionId = transactionId;
    }
}
