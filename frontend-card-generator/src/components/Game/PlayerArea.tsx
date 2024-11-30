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
                isSelectable={(card) => isSelectable && card.hp > 0} 
            />
        </Box>
    );
};

export default PlayerArea;
