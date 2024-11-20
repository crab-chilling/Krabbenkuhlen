import Player from "../entity/Player";
import Card from "../entity/Card";
import axios from "axios";

let players = [];
let currentPlayerIndex = 0;

const DODGE_CHANCE = 0.15;
const CRITICAL_HIT_CHANCE = 0.20;
const URL = "http://tp.cpe.fr:8083";
const USER = "/user";

async function game(io) {
  io.on("connection", (socket) = {
    await initGame(io, socket);
  });
}

async function initGame(io, socket) {
  // todo: socket ID joueur
  // todo: socket array ID card
  let response = await axios.get(URL + USER + "/" + socket.id);
  console.log("response: ", response);
  // todo: fetch info user via ID
  // todo: fetch info cartes via le user
  const player = new Player(socket.id)
  players.push(player);

  socket.emit('gameInfo', {
    message: "Game started",
    players: players.map(p => p.getPlayerInfo())
  });

  socket.on('attack', (data) => handleAttack(io, socket, data));
  socket.on('endturn', () => endTurn(io, socket));
}

function handleAttack(io, socket, data) {
  const attacker = players[currentPlayerIndex];
  if (attacker.id != socket.id) {
    socket.emit('error', { message: "Ce n'est pas votre tour !" });
    return;
  }

  const { targetCardId, attackerCardId, targetId } = data
  const target = players.find(p => p.id === targetId);
  const targetCard = target.getCard(targetCardId);
  const attackerCard = attacker.getCard(attackerCardId)

  if (!attackerCard || !targetCard || attacker.actionPoints < attackerCard.energy) {
    socket.emit('error', { message: "Action impossible, points d'actions insuffisants ou cartes invalides" });
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

  if (targetCard.hp <= 0) {
    io.emit('cardKilled', { targetId: target.id, targetCard: targetCard });
  }
  if (target.hasNoCardLeft()) {
    io.emit('Game Over', { winner: attacker.id });
  }
}

function endTurn(io, socket) {
  const player = players[playerCurrentIndex];
  if (player.id !== socket.id) {
    socket.emit('error', { messsage: "Ce n'est pas votre tour !" });
    return;
  }
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  io.emit('nextTurn', { playerId: players[currentPlayerIndex].id });
}


function calculateDamage(attack, defense) {
  const isCritical = Math.random() < CRITICAL_HIT_CHANCE;
  const isDodged = Math.random() < DODGE_CHANCE;

  if (isDodged) {
    return 0;
  }
  return (attack * (isCritical ? 2 : 1)) - defense;
}

module.exports = { initGame };
