import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import notFoundImage from "../assets/not-found.jpg";

export default function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        marginTop: "5vh",
      }}
    >
      <img
        src={notFoundImage}
        alt="Not Found"
        style={{ marginBottom: "16px", maxWidth: "30%" }}
      />
      <Typography variant="h4" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" gutterBottom>
        The page you are looking for does not exist.
      </Typography>
      <Button
        sx={{ marginTop: "3vh" }}
        variant="contained"
        color="primary"
        component={Link}
        to="/"
      >
        Back to Home Page
      </Button>
    </Box>
  );
}
