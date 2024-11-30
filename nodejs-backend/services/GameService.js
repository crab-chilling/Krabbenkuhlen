import Player from "../entity/Player.js";


const DODGE_CHANCE = 0.15;
const CRITICAL_HIT_CHANCE = 0.20;

class GameService {

    constructor(){
        this.players = [];
        this.currentPlayerIndex = 0;

        this.initGame = this.initGame.bind(this);
    }

    initGame(player1, player2, socket) {
        console.log("Initializing game")
        this.players.push(player1);
        this.players.push(player2);

        console.log("init game ",this.players)

        socket.emit('yourTurn', {player: player2})


    }

    calculateDamage(attack, defense){
        const isCritical = Math.random() < CRITICAL_HIT_CHANCE;
        const isDodged = Math.random() < DODGE_CHANCE;

        if(isDodged){
            return 0;
        }
        return (attack * (isCritical ? 2 : 1)) - defense;
    }

    endTurn(io){
        const player = this.players[this.currentPlayerIndex];
        player.actionPoints = 100;
        io.emit('yourTurn', { player: this.players[this.currentPlayerIndex]});
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    handleAttack(data, io) {
        const attacker = this.players.find(a => a.id === data.attackerId)
        const target = this.players.find(p => p.id === data.targetId);
        const targetCard = target.getCard(data.targetCardId);
        const attackerCard = attacker.getCard(data.attackerCardId)

        if (!attackerCard || !targetCard){
            io.emit('error', {errorTitle: "Carte inconnu", errorMessage: "Vous n'avez pas sélectionner une de vos cartes ou une carte de l'adversaire"})
            return;
        }
        if(attacker.actionPoints < attackerCard.energy){
            io.emit('error', {errorTitle: "Points d'actions insuffisants", errorMessage: "Vous n'avez pas assez de points d'actions pour faire attaquer cette carte"})
            return;
        }

        const damage = this.calculateDamage(attackerCard.attack, targetCard.defense);
        targetCard.hp = targetCard.hp - damage;
        if(isNaN(targetCard.hp)){
            targetCard.hp = 0;
        }
        attacker.actionPoints -= attackerCard.energy;

        if(targetCard.hp <= 0){
            const index = target.cards.cards.indexOf(targetCard)
            target.cards.cards.splice(index, 1)
        }
        io.emit('attackResult', {
            attacker: attacker,
            target: target,
        })

        if(target.cards.cards.length == 0){
            this.players = []
            io.emit('gameOver', {winner: attacker});
        }   
    }
}

export default new GameService();
