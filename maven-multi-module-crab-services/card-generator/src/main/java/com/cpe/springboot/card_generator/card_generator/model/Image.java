package com.cpe.springboot.card_generator.card_generator.model;

import jakarta.persistence.*;

@Entity
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String imageUrl;

    private boolean isBase64;

    @OneToOne
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    public Image() {}

    public Image(String imageUrl, boolean isBase64) {
        this.imageUrl = imageUrl;
        this.isBase64 = isBase64;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }

    public boolean isBase64() {
        return isBase64;
    }

    public void setBase64(boolean base64) {
        isBase64 = base64;
    }
}
