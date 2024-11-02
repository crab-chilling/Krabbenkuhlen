package com.cpe.springboot.card_generator.card_generator.model;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private Integer userId;

    private String imagePrompt;

    private String descPrompt;

    private java.sql.Timestamp timestamp;

    @OneToOne(mappedBy = "transaction")
    private Properties properties;

    @OneToOne(mappedBy = "transaction")
    private Image image;

    @OneToOne(mappedBy = "transaction")
    private Description description;

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

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getImagePrompt() {
        return imagePrompt;
    }

    public void setImagePrompt(String imagePrompt) {
        this.imagePrompt = imagePrompt;
    }

    public String getDescPrompt() {
        return descPrompt;
    }

    public void setDescPrompt(String descPrompt) {
        this.descPrompt = descPrompt;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public Properties getProperties() {
        return properties;
    }

    public void setProperties(Properties properties) {
        this.properties = properties;
    }

    public Image getImage() {
        return image;
    }

    public void setImage(Image image) {
        this.image = image;
    }

    public Description getDescription() {
        return description;
    }

    public void setDescription(Description description) {
        this.description = description;
    }
}
