import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const CardComponent = ({ card, onClick, isSelected, isSelectable }) => {
    const isDisabled = card.hp <= 0 || !isSelectable; // La carte est désactivée si elle a 0 HP ou si elle n'est pas sélectionnable

    const handleClick = () => {
        if (!isDisabled) {
            onClick(card); // Ne déclenche l'événement que si la carte est active
        }
    };

    return (
        <MotionCard
            onClick={handleClick}
            sx={{
                width: 120,
                cursor: isDisabled ? 'not-allowed' : 'pointer', // Change le curseur si la carte est désactivée
                position: 'relative',
                border: isSelected ? '3px solid #ffeb3b' : 'none', // Encadre la carte sélectionnée
                boxShadow: isSelected ? 6 : 3,
                transition: 'border 0.3s, box-shadow 0.3s',
                backgroundColor: isDisabled ? 'lightgray' : 'white', // Grise la carte désactivée
                opacity: isDisabled ? 0.5 : 1, // Réduit l'opacité pour une carte désactivée
            }}
            whileHover={!isDisabled ? { scale: 1.05, boxShadow: 6 } : {}} // Animation hover uniquement si la carte est active
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <CardMedia
                component="img"
                height="140"
                image={card.image}
                alt={card.name}
                sx={{ filter: isDisabled ? 'grayscale(100%)' : 'none' }} // Grise l'image si la carte est désactivée
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
