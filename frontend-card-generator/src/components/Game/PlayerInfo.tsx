import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';

const PlayerInfo = ({ player }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 1 }}>
            <Avatar src={player.image} alt={player.name} sx={{ width: 56, height: 56 }} />
            <Box>
                <Typography variant="h6">{player.name}</Typography>
                <Typography variant="body1">Points d'action: {player.actpoints}</Typography>
            </Box>
        </Box>
    );
};

export default PlayerInfo;
