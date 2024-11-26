// src/components/CardComponent.js
import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const CardComponent = ({ card, onClick, isSelected }) => {
    return (
        <MotionCard
            onClick={() => onClick(card)}
            sx={{
                width: 120,
                cursor: 'pointer',
                position: 'relative',
                border: isSelected ? '3px solid #ffeb3b' : 'none',
                boxShadow: isSelected ? 6 : 3,
                transition: 'border 0.3s, box-shadow 0.3s',
            }}
            whileHover={{ scale: 1.05, boxShadow: 6 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <CardMedia
                component="img"
                height="140"
                image={card.image}
                alt={card.name}
            />
            <CardContent sx={{ padding: '8px !important' }}>
                <Typography variant="subtitle1" component="div" noWrap>
                    {card.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                        HP: {card.hp}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Atk: {card.attack}
                    </Typography>
                </Box>
            </CardContent>
        </MotionCard>
    );
};

export default CardComponent;
