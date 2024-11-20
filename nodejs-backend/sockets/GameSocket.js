import GameService from '../services/GameService.js'

let waitingPlayers = [];

export default function (io)  {
    io.on('connection', (socket) => {
        socket.on('findMatch', () => {
            console.log(`Joueur ${socket.id} cherche une partie`)
            waitingPlayers.push(socket)



            const rooms = Array.from(io.of('/').adapter.rooms.keys()).filter((room) => room.startsWith('room-'));

            console.log(rooms)
            let roomId = `room-${socket.id}`
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

            let roomMembers = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            console.log(`Membres de la room ${roomId} :`, roomMembers);
            if(waitingPlayers.length >= 2){
                const player1 = waitingPlayers.shift();
                const player2 = waitingPlayers.shift();

                console.log(roomId)
                console.log(`Match trouvé ${player1.id} contre ${player2.id}`);
                io.emit('matchFound', {
                    players: [player1.id, player2.id]
                })
            }
        })
    })

    io.on('attack', (data) => GameService.handleAttack(io, socket, data));
    io.on('endturn', () => GameService.endTurn(io, socket));
}