package com.cpe.springboot.dto.queues;

public class PropertiesDTO extends GenericMQDTO {

    private float hp;

    private float energy;

    private float attack;

    private float defense;

    public PropertiesDTO(Integer transactionId, float hp, float energy, float attack, float defense) {
        super(transactionId);
        this.hp = hp;
        this.energy = energy;
        this.attack = attack;
        this.defense = defense;
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
