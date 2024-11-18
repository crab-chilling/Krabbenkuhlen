import React, {useState, useEffect} from 'react';
import { User } from "../../types/user";
import {io} from "socket.io-client";

const socket = io('http://localhost:3000', {
    transports: ['websocket'],
    withCredentials: true
});


const Game: React.FC = () => {
    const [attackResult, setAttackResult] = useState(null); 
    const [currentPlayer, setCurrentPlayer] = useState<User | null>(null);
    const [opponent, setOpponent] = useState<User | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [roomId, setRoomId] = useState(null);

    useEffect(() => {
        socket.on('connect', () => {
            console.log("Connecté au serveur websocket (socket.io)")
        })

        socket.on('matchFound', (data) => {
            console.log("Match trouvé ", data)
            setRoomId(data.roomId);
            const current = data.players.find(player => player === socket.id);
            const opponentPlayer = data.players.find(player => player !== socket.id);
            setCurrentPlayer(current);
            setOpponent(opponentPlayer);
            setIsSearching(false);
        })

        socket.on('attackResult', (data) => {
            console.log(data)
            setAttackResult(data);
        })

        return() => {
            socket.off('gameConnection')
            socket.off('gameInfo');
            socket.off('attackResult');
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

    const findMatch = () => {
        setIsSearching(true);
        socket.emit('findMatch');
    };

    return (
        <div>
            <h1>Tableau de Bord du Joueur</h1>
            {!roomId ? (
                <div>
                    <button onClick={findMatch} disabled={isSearching}>
                        {isSearching ? 'Recherche d\'une partie...' : 'Trouver une Partie'}
                    </button>
                </div>
            ) : (
                <div>
                    <h2>Partie dans la salle : {roomId}</h2>
                    <p>Adversaire : {opponent ? opponent : 'En attente...'}</p>
                </div>
            )}

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