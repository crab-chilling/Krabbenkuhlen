import Player from '../entity/Player.js';
import GameService from '../services/GameService.js'

let waitingPlayers = [];

export default function (io)  {
    io.on('connection', (socket) => {
        console.log("A user connected", socket.id);
        socket.on('findMatch', (data) => {
            console.log(`Joueur ${data.player.id} cherche une partie`)
            waitingPlayers.push(new Player(data.player.id, data.player.surname, data.player.lastName, data.player.cards))
            let roomId = `gaming-room-${socket.id}`
            const rooms = Array.from(io.of('/').adapter.rooms.keys()).filter((room) => room.startsWith('gaming-room-'));
            

            console.log(rooms)
            if(rooms.length !== 0){
                roomId = rooms.shift();
                console.log("Joining room : ", roomId)
                socket.join(roomId);
                io.to(roomId).emit('joinRoom', {
                    roomId
                })
            }else {
                console.log("Creating and joining room : ", roomId)
                socket.join(roomId)
                io.emit('joinRoom', {
                    roomId
                });
            }
            if(waitingPlayers.length >= 2){
                console.log(waitingPlayers)
                const player1 = waitingPlayers.shift();
                const player2 = waitingPlayers.shift();

                console.log(`Match trouvé ${player1} contre ${player2}`);
                io.emit('matchFound', {
                    roomId,
                    players: [player1, player2]
                })
                GameService.initGame(player1, player2, socket);
                
            }
        })

        socket.on('attack', (data) => {
            GameService.handleAttack(data, io)
        })

        socket.on('endTurn', () => {
            GameService.endTurn(io)
        })
    })
}