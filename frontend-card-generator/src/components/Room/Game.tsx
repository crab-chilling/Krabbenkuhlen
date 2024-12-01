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

    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [errorTitle, setErrorTitle] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const [selectedAttackerCard, setSelectedAttackerCard] = useState(null);
    const [selectedTargetCard, setSelectedTargetCard] = useState(null);

    const [isMyTurn, setIsMyTurn] = useState(false); 
    const [openDialog, setOpenDialog] = useState(false);


    useEffect(() => {    
        connection.current = io("http://localhost:3001", {
            transports: ['websocket'],
            withCredentials: true
        });

        connection.current.on('matchFound', handleMatchFound);
        connection.current.on('attackResult', handleAttackResult)
        connection.current.on('yourTurn', handleYourTurn)
        connection.current.on('endTurn', handleEndTurn)
        connection.current.on('error', handleError)
        connection.current.on('gameOver', handleGameOver)
    
        connection.current.on("disconnect", () => {
          console.log("Socket.IO connection closed");
        });
    
        return () => {
          if (connection.current) {
            connection.current.disconnect();
          }
        };
      }, []);

    const handleError = (data) => {
        setErrorTitle(data.errorTitle);
        setErrorMessage(data.errorMessage);

        setOpenErrorDialog(true);
    } 


    const handleGameOver = (data) => {
        setOpenDialog(true)
    }  
    const handleMatchFound = (data) => {
        setRoomId(data.roomId)
        const current = data.players.find(player => player.id === userId);
        const opponentPlayer = data.players.find(player => player.id !== userId);
        setCurrentPlayer(current);
        setOpponent(opponentPlayer);
        setIsSearching(false);
    }

    const handleYourTurn = (data) => {
        if(data.player.id == userId){
            setCurrentPlayer(data.player)
            setIsMyTurn(true);
        }
        
    }

    const handleEndTurn = (data) => {
        if(data.player.id === userId){
            setIsMyTurn(false);
        }
    }

    const handleAttackResult = (data) => {
        if(data.attacker.id === userId){
            setCurrentPlayer(data.attacker);
            setOpponent(data.target);
        }else {
            setOpponent(data.attacker)
            setCurrentPlayer(data.target)
        }


    };


    const handleAttack = () => {
        if (!selectedAttackerCard || !selectedTargetCard) {
            alert('Veuillez sélectionner une carte attaquante et une carte cible.');
            return;
        }

        if(connection.current?.connected && currentPlayer != null && opponent != null){
            connection.current.emit('attack', {
                roomId,
                attackerId: currentPlayer.id,
                targetId: opponent.id,
                attackerCardId: selectedAttackerCard.id,
                targetCardId: selectedTargetCard.id,
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
                player : {id: userId , surname: userSurname, lastName: userLastName, cards: cards}
            });
        }
    }

    const handleChangeTurn = () => {
        if(connection.current?.connected){
            connection.current.emit('endTurn')
            setIsMyTurn(false)
        }
    }

    const handleCloseErrorDialog = () => {
        setOpenErrorDialog(false);
        setErrorTitle(null);
        setErrorMessage(null);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setRoomId(null)
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
                    height="calc(100% - 64px)"
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
                    <Grid item xs={12}>
                        <PlayerArea
                            hero={currentPlayer}
                            battlefieldCards={currentPlayer.cards}
                            onCardClick={(card) => {
                                if (isMyTurn) {
                                    setSelectedAttackerCard(card);
                                }
                            }}
                            isSelectable={isMyTurn}
                            selectedCard={selectedAttackerCard}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <PlayerArea
                            hero={opponent}
                            battlefieldCards={opponent.cards}
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
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Match terminé</DialogTitle>
                <DialogContent>
                    <Typography>Partie terminé !</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Retour au matchmaking
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openErrorDialog} onClose={handleCloseErrorDialog}>
                <DialogTitle>{errorTitle}</DialogTitle>
                <DialogContent>
                    <Typography>{errorMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseErrorDialog} color="primary">
                        Retour
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};


export default Game;