package com.cpe.springboot.dto;

import java.io.Serializable;

public abstract class GenericMQDTO implements Serializable {

    public Integer idTransaction;

    public GenericMQDTO(){}

    public GenericMQDTO(Integer idTransaction) {
        this.idTransaction = idTransaction;
    }

    public Integer getIdTransaction() {
        return idTransaction;
    }

    public void setIdTransaction(Integer idTransaction) {
        this.idTransaction = idTransaction;
    }
}
