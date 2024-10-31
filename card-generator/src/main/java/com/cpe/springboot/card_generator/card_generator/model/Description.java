package com.cpe.springboot.card_generator.card_generator.model;

import jakarta.persistence.*;

@Entity
public class Description {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String description;

    @OneToOne
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    public Description() {}

    public Description(String description) {
        this.description = description;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }
}
