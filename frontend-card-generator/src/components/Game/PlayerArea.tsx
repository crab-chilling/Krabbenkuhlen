// src/components/PlayerArea.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import PlayerInfo from './PlayerInfo';
import Battlefield from './Battlefield';

const PlayerArea = ({ hero, battlefieldCards, onCardClick, isSelectable, selectedCard }) => {
    const selectedCardId = selectedCard ? selectedCard.id : null;

    return (
        <Box
            sx={{
                width: '100%',
                padding: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 2,
                boxShadow: 3,
            }}
        >
            <PlayerInfo player={hero} />
            <Battlefield
                cards={battlefieldCards}
                onCardClick={onCardClick}
                selectedCardId={selectedCardId}
            />
            <Typography variant="subtitle1" align="center" sx={{ marginTop: 2 }}>
                {isSelectable ? 'Cliquez sur une carte pour la sélectionner comme attaquante.' : ''}
            </Typography>
            {selectedCard && (
                <Typography variant="body2" align="center" color="secondary">
                    Carte sélectionnée : {selectedCard.name}
                </Typography>
            )}
        </Box>
    );
};

export default PlayerArea;
