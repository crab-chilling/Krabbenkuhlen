// src/components/Battlefield.js
import React from 'react';
import { Box } from '@mui/material';
import CardComponent from './Card';

const Battlefield = ({ cards, onCardClick, selectedCardId, isSelectable }) => {

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 2,
                padding: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 2,
                minHeight: '160px',
                overflowX: 'auto',
            }}
        >
            {cards.cards.map(card => (
                <CardComponent
                    key={card.id}
                    card={card}
                    onClick={onCardClick}
                    isSelected={selectedCardId === card.id}
                    isSelectable={isSelectable(card)}
                />
            ))}
        </Box>
    );
};

export default Battlefield;
