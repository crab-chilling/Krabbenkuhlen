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
        console.log("Turn to ", player)
        io.emit('yourTurn', { player: this.players[this.currentPlayerIndex]});
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    handleAttack(data, io) {
        console.log("attaque")
        console.log(io)
        const attacker = this.players[this.currentPlayerIndex];
        console.log(attacker)
        if(attacker.id != data.attackerId){
            io.emit('error', {message: "Ce n'est pas votre tour !"});
            return;
        }
        const target = this.players.find(p => p.id === data.targetId);
        console.log(target)
        const targetCard = target.getCard(data.targetCardId);
        const attackerCard = attacker.getCard(data.attackerId)

        if (!attackerCard || !targetCard || attacker.actionPoints < attackerCard.energy){
            io.emit('error', {message: "Action impossible, points d'actions insuffisants ou cartes invalides"});
            return;
        }

        const damage = calculateDamage(attackerCard.attack, targetCard.defense);
        const actualDamage = targetCard.takeDamage(damage);

        attacker.actionPoints -= attackerCard.energy;

        io.emit('attackResult', {
            attackerId: attacker.id,
            targetId: target.id,
            damage: actualDamage,
            attackerCard: attackerCard,
            targetCard: targetCard,
            targetCardHp: targetCard.hp
        })

        if(targetCard.hp <= 0){
            io.emit('cardKilled', {targetId: target.id, targetCard: targetCard});
        }
        if(target.hasNoCardLeft()){
            io.emit('Game Over', {winner: attacker.id});
        }   
    }
}

export default new GameService();
