export default class Player {
    constructor(id, health, cards){
        this.id = id;
        this.health = health;
        this.actionPoints = 10;
        this.cards = cards;
    }

    getCard(cardId) {
        return this.cards.find(card => card.id === cardId);
    }

    getPlayerInfo() {
        return { id : this.id, health: this.health, actionPoints: this.actionPoints, cards: this.cards}
    }

    hasNoCardLeft(){
        return this.cards.every(card => card.hp <= 0);
    }
}