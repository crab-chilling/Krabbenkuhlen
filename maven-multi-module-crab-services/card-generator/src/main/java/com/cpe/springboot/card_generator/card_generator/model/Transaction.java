package com.cpe.springboot.card_generator.card_generator.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Cascade;

import java.sql.Timestamp;

@Entity
@Data
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private Integer userId;

    private String imagePrompt;

    private String descPrompt;

    private java.sql.Timestamp timestamp;

    private float hp;

    private float energy;

    private float attack;

    private float defense;

    private String imageUrl;

    private boolean isBase64;

    @Column(columnDefinition = "TEXT")
    private String description;

    public Transaction() {
        this.timestamp = new Timestamp(System.currentTimeMillis());
    }

    public Transaction(Integer userId, String imagePrompt, String descPrompt) {
        super();
        this.userId = userId;
        this.imagePrompt = imagePrompt;
        this.descPrompt = descPrompt;
        this.timestamp = new Timestamp(System.currentTimeMillis());
    }
}
