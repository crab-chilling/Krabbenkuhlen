package com.cpe.springboot.dto.requests;

public class CardRequestDTO {


    private String Base64Image;
    private float hp;
    private float energy;
    private float attack;
    private float defense;

    public CardRequestDTO() {}

    public CardRequestDTO(float hp, float energy, float attack, float defense, String Base64Image) {
        this.hp = hp;
        this.energy = energy;
        this.attack = attack;
        this.defense = defense;
        this.Base64Image = Base64Image;
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

    public String getBase64Image() {
        return Base64Image;
    }

    public void setBase64Image(String Base64Image) {
        this.Base64Image = Base64Image;
    }
}
