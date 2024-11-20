import React, {useState, useEffect} from 'react';
import {io} from "socket.io-client";

const socket = io('http://localhost:3000', {
    transports: ['websocket'],
    withCredentials: true
});


const Game: React.FC = (props) => {

    const [attackResult, setAttackResult] = useState(null); 
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [opponent, setOpponent] = useState(null);

    useEffect(() => {
        socket.on('connect', () => {
            console.log("Connecté au serveur websocket (socket.io)")
        })

        socket.on('matchFound', (data) => {
            console.log("Match trouvé ", data)
            console.log(socket.id);
            const current = data.players.find(player => player === socket.id);
            const opponentPlayer = data.players.find(player => player !== socket.id);
            setCurrentPlayer(current);
            setOpponent(opponentPlayer);
        })

        socket.on('attackResult', (data) => {
            console.log(data)
            setAttackResult(data);
        })

        return() => {
            socket.disconnect();
        };
    }, []);

    const handleAttack = (attackerCardId: number, targetCardId: number) => {
        if(roomId){
            socket.emit('attack', {
                roomId,
                attackerId: currentPlayer,
                targetId: opponent,
                attackerCardId,
                targetCardId,
    
            })
        }

    };

    return (
        <div>                
            <div>
                <h2>Partie dans la salle : {props.roomId}</h2>
                <p>Adversaire : {opponent ? opponent : 'En attente...'}</p>
            </div>

            {roomId && (
                <div>
                    <h2>Cartes</h2>
                    {/* Exemple de cartes du joueur (à remplacer par vos données réelles) */}
                    <div style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
                        <p>Nom: Carte 1</p>
                        <p>HP: 100</p>
                        <p>Attaque: 20</p>
                        <p>Défense: 10</p>
                        <p>Énergie: 5</p>
                        <button onClick={() => handleAttack('card1', 'targetCardId')}>
                            Attaquer
                        </button>
                    </div>
                    {/* Ajouter d'autres cartes selon les besoins */}
                </div>
            )}

            {attackResult && (
                <div>
                    <h2>Résultat de l'Attaque</h2>
                    <p>Dégâts infligés : {attackResult.damage}</p>
                    <p>Carte cible HP restant : {attackResult.targetCardHp}</p>
                </div>
            )}
        </div>
    );
};


export default Game;