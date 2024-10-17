import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface LoaderProps {
  overlay?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ overlay }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...(overlay && {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "rgba(255, 255, 255, 0.7)",
          zIndex: 9999,
        }),
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
