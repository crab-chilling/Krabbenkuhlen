package com.cpe.springboot.card_generator.transaction.service;

import com.cpe.springboot.card_generator.transaction.enums.TransactionStatus;
import com.cpe.springboot.card_generator.transaction.model.TransactionModel;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {

    public TransactionService(){};

    public Integer instantiateTransaction(Integer userId){
        TransactionModel transactionModel = new TransactionModel(userId);
        return transactionModel.getId();
    }
}
