package com.cpe.springboot.dto.queues;

public class CreatedCardDTO {

    public String imageUrl;

    public boolean isBase64;

    public String Description;

    public float hp;

    public float energy;

    public float attack;

    public float defense;

    public CreatedCardDTO() {

    }

    public CreatedCardDTO(String imageUrl, boolean isBase64, String description, float hp, float energy, float attack, float defense) {
        this.imageUrl = imageUrl;
        this.isBase64 = isBase64;
        Description = description;
        this.hp = hp;
        this.energy = energy;
        this.attack = attack;
        this.defense = defense;
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
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
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
}
