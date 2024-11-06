import Player from "../entity/Player";
import Card from "../entity/Card";

let players = [];
let currentPlayerIndex = 0;

const DODGE_CHANCE = 0.15;
const CRITICAL_HIT_CHANCE = 0.20;

function initGame(io, socket) {

    
    const player = new Player(socket.id)
    players.push(player);

    socket.emit('gameInfo', {
        message: "Game started",
        players: players.map(p => p.getPlayerInfo())
    });

    socket.on('attack', (data) => handleAttack(io, socket, data));
    socket.on('endturn', () => endTurn(io, socket));

    function handleAttack(io, socket, data) {
        const attacker = player[currentPlayerIndex];
        if(attacker.id != socket.id){
            socket.emit('error', {message: "Ce n'est pas votre tour !"});
            return;
        }

        const { targetCardId, attackerCardId, targetId } = data
        const target = players.find(p => p.id === targetId);
        const targetCard = target.getCard(targetCardId);
        const attackerCard = attacker.getCard(attackerCardId)

        if (!attackerCard || !targetCard || attacker.actionPoints < card.energy){
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


    function calculateDamage(attack, defense){
        const isCritical = Math.random() < CRITICAL_HIT_CHANCE;
        const isDodged = Math.random() < DODGE_CHANCE;

        if(isDodged){
            return 0;
        }
        return (attack * (isCritical ? 2 : 1)) - defense;
    }

    function endTurn(io, socket){
        const player = players[playerCurrentIndex];
        if(player.id !== socket.id){
            socket.emit('error', {messsage: "Ce n'est pas votre tour !"});
            return;
        }
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        io.emit('nextTurn', { playerId: players[currentPlayerIndex].id});
    }
}

module.exports = {initGame};
