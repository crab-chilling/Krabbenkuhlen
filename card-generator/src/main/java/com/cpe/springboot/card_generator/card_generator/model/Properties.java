package com.cpe.springboot.card_generator.card_generator.model;

import jakarta.persistence.*;

@Entity
public class Properties {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private float hp;

    private float energy;

    private float attack;

    private float defense;

    @OneToOne
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    public Properties()  {}

    public Properties(float hp, float energy, float attack, float defense) {
        this.hp = hp;
        this.energy = energy;
        this.attack = attack;
        this.defense = defense;
    }

    public Integer getId() {
        return id;
    }

    public float getHp() {
        return hp;
    }

    public float getEnergy() {
        return energy;
    }

    public float getAttack() {
        return attack;
    }

    public float getDefense() {
        return defense;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setHp(float hp) {
        this.hp = hp;
    }

    public void setEnergy(float energy) {
        this.energy = energy;
    }

    public void setAttack(float attack) {
        this.attack = attack;
    }

    public void setDefense(float defense) {
        this.defense = defense;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }
}
