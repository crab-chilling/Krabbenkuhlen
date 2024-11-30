import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';

const PlayerInfo = ({ player }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 1 }}>
            <Box>
                <Typography variant="h6">{`${player?.surname ?? "Prénom"} ${player?.lastname ?? "Nom"}`}</Typography>
                <Typography variant="body1">Points d'action: {player?.actionPoints ?? "Non définis"}</Typography>
            </Box>
        </Box>
    );
};

export default PlayerInfo;
