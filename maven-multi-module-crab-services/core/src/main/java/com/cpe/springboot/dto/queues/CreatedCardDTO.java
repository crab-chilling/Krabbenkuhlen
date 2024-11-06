package com.cpe.springboot.dto.queues;

public class CreatedCardDTO extends GenericMQDTO{

    public Integer userId;

    public String imageUrl;

    public boolean isBase64;

    public String description;

    public float hp;

    public float energy;

    public float attack;

    public float defense;

    public float price = 50.0f;

    public CreatedCardDTO() {

    }

    public CreatedCardDTO(Integer userId, String imageUrl, boolean isBase64, String description, float hp, float energy, float attack, float defense, float price) {
        this.userId = userId;
        this.imageUrl = imageUrl;
        this.isBase64 = isBase64;
        this.description = description;
        this.hp = hp;
        this.energy = energy;
        this.attack = attack;
        this.defense = defense;
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean isBase64() {
        return isBase64;
    }

    public void setBase64(boolean base64) {
        isBase64 = base64;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        description = description;
    }

    public float getHp() {
        return hp;
    }

    public void setHp(float hp) {
        this.hp = hp;
    }

    public float getEnergy() {
        return energy;
    }

    public void setEnergy(float energy) {
        this.energy = energy;
    }

    public float getAttack() {
        return attack;
    }

    public void setAttack(float attack) {
        this.attack = attack;
    }

    public float getDefense() {
        return defense;
    }

    public void setDefense(float defense) {
        this.defense = defense;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
