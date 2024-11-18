import GameService from '../services/GameService.js'

let waitingPlayers = [];

export default function (io)  {
    io.on('connection', (socket) => {
        console.log("User connected : ", socket.id)
        socket.on('findMatch', () => {
            console.log(`Joueur ${socket.id} cherche une partie`)
            waitingPlayers.push(socket)

            if(waitingPlayers.length >= 2){
                const player1 = waitingPlayers.shift();
                const player2 = waitingPlayers.shift();

                const roomId = `room-${player1.id}-${player2.id}`;

                player1.join(roomId);
                player2.join(roomId);

                console.log(`Match trouvé ${player1.id} contre ${player2.id}`);
                io.to(roomId).emit('matchFound', {
                    roomId,
                    players: [player1.id, player2.id]
                })
            }
        })
    })

    io.on('attack', (data) => GameService.handleAttack(io, socket, data));
    io.on('endturn', () => GameService.endTurn(io, socket));
}