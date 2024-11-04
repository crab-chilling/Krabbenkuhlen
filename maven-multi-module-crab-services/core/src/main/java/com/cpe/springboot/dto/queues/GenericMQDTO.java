package com.cpe.springboot.dto.queues;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;

public abstract class GenericMQDTO implements Serializable {

    @JsonProperty("transactionId")
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
