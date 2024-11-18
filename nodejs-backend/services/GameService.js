import Player from "../entity/Player.js";


const DODGE_CHANCE = 0.15;
const CRITICAL_HIT_CHANCE = 0.20;

class GameService {

    constructor(){
        this.players = [];
        this.currentPlayerIndex = 0;

        this.initGame = this.initGame.bind(this);
    }

    initGame(io, socket) {
        console.log("Initializing game" + socket.id)
        const player = new Player(socket.id, 30, null)
        this.players.push(player);

        socket.emit('gameInfo', {
            message: "Game started",
            players: this.players.map(p => p.getPlayerInfo())
        });


    }

    calculateDamage(attack, defense){
        const isCritical = Math.random() < CRITICAL_HIT_CHANCE;
        const isDodged = Math.random() < DODGE_CHANCE;

        if(isDodged){
            return 0;
        }
        return (attack * (isCritical ? 2 : 1)) - defense;
    }

    endTurn(io, socket){
        const player = this.players[this.currentPlayerIndex];
        if(player.id !== socket.id){
            socket.emit('error', {messsage: "Ce n'est pas votre tour !"});
            return;
        }
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        io.emit('nextTurn', { playerId: this.players[this.currentPlayerIndex].id});
    }

    handleAttack(io, socket, data) {
        const attacker = this.players[this.currentPlayerIndex];
        if(attacker.id != socket.id){
            socket.emit('error', {message: "Ce n'est pas votre tour !"});
            return;
        }

        const { targetCardId, attackerCardId, targetId } = data
        const target = this.players.find(p => p.id === targetId);
        const targetCard = target.getCard(targetCardId);
        const attackerCard = attacker.getCard(attackerCardId)

        if (!attackerCard || !targetCard || attacker.actionPoints < attackerCard.energy){
            socket.emit('error', {message: "Action impossible, points d'actions insuffisants ou cartes invalides"});
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
