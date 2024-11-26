import React, {useState, useEffect, useRef} from 'react';
import {io, Socket} from "socket.io-client";
import { useSelector } from "react-redux";
import { selectUserId } from "../../store/selectors/user.selectors";
import { selectUserLastName } from "../../store/selectors/user.selectors";
import { selectUserSurname } from "../../store/selectors/user.selectors";
import { Button, Grid, Box, Typography, Dialog, DialogContent, DialogTitle, DialogActions, CircularProgress  } from "@mui/material";
import  PlayerArea from '../Game/PlayerArea';


const Game: React.FC = (cards) => {

    const userId = useSelector(selectUserId);
    const userLastName = useSelector(selectUserLastName);
    const userSurname = useSelector(selectUserSurname);

    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [opponent, setOpponent] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const connection = useRef<Socket | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const [opponentBattlefield, setOpponentBattlefield] = useState([
        { id: 'opponent-card1', name: 'Golem de Pierre', hp: 25, attack: 5 },
        { id: 'opponent-card2', name: 'Spectre Fantomatique', hp: 10, attack: 7},
        
    ]);

    const [selectedAttackerCard, setSelectedAttackerCard] = useState(null);
    const [selectedTargetCard, setSelectedTargetCard] = useState(null);

    const [selectedTargetCardId, setSelectedTargetCardId] = useState('');
    const [isMyTurn, setIsMyTurn] = useState(false); 
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    const [opponentHero, setOpponentHero] = useState({
        name: 'Adversaire',
        actpoints: 10,
        image: '/images/opponent-hero.png',
    });

    const [playerHero, setPlayerHero] = useState({
        name: userSurname + " " + userLastName,
        actpoints: 10,
        image: '/images/player-hero.png',
    });


    const [playerBattlefield, setPlayerBattlefield] = useState([
        { id: 'player-card1', name: 'Dragon de Feu', hp: 20, attack: 8},
        { id: 'player-card2', name: 'Esprit de l\'Eau', hp: 15, attack: 6 },
    ]);

    useEffect(() => {    
        connection.current = io("http://localhost:3000", {
            transports: ['websocket'],
            withCredentials: true
        });

        connection.current.on('matchFound', handleMatchFound);
        connection.current.on('attackResult', handleAttackResult)
        connection.current.on('yourTurn', handleYourTurn)
        connection.current.on('endTurn', handleEndTurn)
    
        connection.current.on("disconnect", () => {
          console.log("Socket.IO connection closed");
        });
    
        return () => {
          if (connection.current) {
            connection.current.disconnect();
          }
        };
      }, []);

    const handleMatchFound = (data) => {
        console.log("Match trouvé ", data)
        setRoomId(data.roomId)
        const current = data.players.find(player => player === userId);
        const opponentPlayer = data.players.find(player => player !== userId);
        setCurrentPlayer(current);
        setOpponent(opponentPlayer);
        setIsSearching(false);
    }

    const handleYourTurn = (data) => {
        console.log("turn", data)
        if(data.player.id == userId){
            setIsMyTurn(true);
        }
        
    }

    const handleEndTurn = (data) => {
        console.log(data)
        if(data.player.id === userId){
            setIsMyTurn(false);
        }
    }

    const handleAttackResult = (data) => {
        console.log(data)
        const { damage, targetCardHp, targetCardId, attackerId } = data;

        if (attackerId === userId) {
            // Attaque du joueur, mettre à jour les HP de la carte adversaire
            setOpponentBattlefield((prev) =>
                prev.map((card) =>
                    card.id === targetCardId ? { ...card, hp: targetCardHp } : card
                )
            );
        } else {
            // Attaque de l'adversaire, mettre à jour les HP de la carte du joueur
            setPlayerBattlefield((prev) =>
                prev.map((card) =>
                    card.id === targetCardId ? { ...card, hp: targetCardHp } : card
                )
            );
        }

        // Vérifier si une carte est détruite
        checkCardDestruction();
    };

    const checkCardDestruction = () => {
        const opponentAliveCards = opponentBattlefield.filter((card) => card.hp > 0);
        const playerAliveCards = playerBattlefield.filter((card) => card.hp > 0);

        if (opponentAliveCards.length === 0 && connection.current?.connected) {
            // Le joueur a gagné
            connection.current.emit('gameOver', { roomId, winnerId: userId });
        } else if (playerAliveCards.length === 0 && connection.current?.connected) {
            // L'adversaire a gagné
            connection.current.emit('gameOver', { roomId, winnerId: opponent });
        }
    };

    const handleAttack = () => {
        console.log("ATTAQUE")
        if (!selectedAttackerCard || !selectedTargetCard) {
            alert('Veuillez sélectionner une carte attaquante et une carte cible.');
            return;
        }

        if(connection.current?.connected){
            connection.current.emit('attack', {
                roomId,
                attackerId: userId,
                targetId: opponent,
                attackerCardId: selectedAttackerCard,
                targetCardId: selectedTargetCard,
            });
        }

        // Réinitialiser les sélections
        setSelectedAttackerCard(null);
        setSelectedTargetCard(null);
    };

    const findMatch = () => {
        setIsSearching(true);
        if(connection.current?.connected){
            connection.current.emit('findMatch',{
                player : {id: userId, cards: cards}
            });
        }
    }

    const handleChangeTurn = () => {
        if(connection.current?.connected){
            connection.current.emit('endTurn')
            setIsMyTurn(false)
        }
    }

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    return (
        <Box sx={{ height: '100vh', backgroundColor: 'background.default', padding: 4, position: 'relative' }}>
            {/* Si roomId n'est pas défini, afficher le bouton de matchmaking */}
            {!roomId ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height="calc(100% - 64px)" // Ajustement pour la hauteur de l'AppBar
                >
                    <Button
                        onClick={findMatch}
                        disabled={isSearching}
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ padding: '12px 24px', fontSize: '16px' }}
                    >
                        {isSearching ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "Trouver une Partie"
                        )}
                    </Button>
                    {isSearching && (
                        <Typography variant="h6" sx={{ marginTop: 2, color: 'text.secondary' }}>
                            Recherche d'une partie...
                        </Typography>
                    )}
                </Box>
            ) : (
                // Interface de Jeu
                <Grid container spacing={4} direction="column" sx={{ height: 'calc(100% - 64px)' }}>
                    {/* Zone du Joueur (en haut) */}
                    <Grid item xs={12}>
                        <PlayerArea
                            hero={playerHero}
                            battlefieldCards={playerBattlefield}
                            onCardClick={(card) => {
                                if (isMyTurn) {
                                    setSelectedAttackerCard(card);
                                }
                            }}
                            isSelectable={isMyTurn}
                            selectedCard={selectedAttackerCard}
                        />
                    </Grid>

                    {/* Zone de l'Adversaire (en dessous) */}
                    <Grid item xs={12}>
                        <PlayerArea
                            hero={opponentHero}
                            battlefieldCards={opponentBattlefield}
                            onCardClick={(card) => {
                                if (isMyTurn) {
                                    setSelectedTargetCard(card);
                                }
                            }}
                            isSelectable={isMyTurn}
                            selectedCard={selectedTargetCard}
                        />
                    </Grid>
                </Grid>
            )}

            {/* Boutons d'Action */}
            {roomId && isMyTurn && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleAttack}
                        disabled={!selectedAttackerCard || !selectedTargetCard}
                        sx={{ padding: '10px 20px' }}
                    >
                        Attaquer
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleChangeTurn}
                        sx={{ padding: '10px 20px' }}
                    >
                        Finir le Tour
                    </Button>
                </Box>
            )}

            {/* Dialog de Fin de Partie */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{winner}</DialogTitle>
                <DialogContent>
                    <Typography>La partie est terminée. Merci d'avoir joué !</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Retour au Matchmaking
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};


export default Game;