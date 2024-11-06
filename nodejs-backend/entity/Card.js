class Card {
    constructor(hp, defense, attack, energy){
        this.hp = hp;
        this.defense = defense;
        this.attack = attack;
        this.energy = energy;
    }

    takeDamage(damage){
        const effectiveDamage = Math.max(damage - this.defense, 0);
        this.hp = Math.max(this.hp - effectiveDamage, 0);
        return effectiveDamage;
    }
}

module.exports.Card;