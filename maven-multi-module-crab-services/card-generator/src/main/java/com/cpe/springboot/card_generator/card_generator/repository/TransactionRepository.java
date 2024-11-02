package com.cpe.springboot.card_generator.card_generator.repository;

import com.cpe.springboot.card_generator.card_generator.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
}
