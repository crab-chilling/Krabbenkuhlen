package com.cpe.springboot.card_generator.transaction.model;

import com.cpe.springboot.card_generator.transaction.enums.TransactionStatus;
import jakarta.persistence.*;

import static com.cpe.springboot.card_generator.transaction.enums.TransactionStatus.OPENED;

@Entity
public class TransactionModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private Integer userId;

    private TransactionStatus status;

    public TransactionModel(){}

    public TransactionModel(Integer userId){
        this.userId = userId;
        this.status = OPENED;
    }

    public Integer getId() {
        return id;
    }

    public Integer getUserId() {
        return userId;
    }

    public TransactionStatus getStatus(){
        return status;
    }
}
