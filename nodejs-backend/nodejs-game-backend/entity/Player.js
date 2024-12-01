export default class Player {
    constructor(id, surname, lastname, cards){
        this.id = id;
        this.actionPoints = 100;
        this.surname = surname;
        this.lastname = lastname;
        this.cards = cards;
    }

    getCard(cardId) {
        return this.cards.cards.find(card => card.id === cardId);
    }

    getPlayerInfo() {
        return { id : this.id, health: this.health, actionPoints: this.actionPoints, cards: this.cards}
    }

    hasNoCardLeft(){
        console.log("test")
        console.log("cartes :", this.cards.cards)
        console.log(this.cards.cards.every(card => card.hp <= 0))
        return this.cards.cards.every(card => card.hp <= 0);
    }
}