import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import crabGif from "../assets/crab.gif";

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <img
        src={crabGif}
        alt="Powered by"
        style={{ width: "70px", height: "70px" }}
      />
      <Typography variant="caption">© CrabChilling</Typography>
    </Box>
  );
};

export default Footer;
