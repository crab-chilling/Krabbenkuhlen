import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { fetchUserInfoById, login } from "../api/user";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import JSConfetti from "js-confetti";
import { useDispatch } from "react-redux";
import { loginAction } from "../store/actions/user.actions";
import { fetchUserCards } from "../api/card";
import { setInventoryCards } from "../store/actions/inventory.actions";

export default function Login() {
  const confetti = new JSConfetti();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const userId = await login(username, password);
      const userData = await fetchUserInfoById(userId);
      const userCards = await fetchUserCards(userData.cardList);

      dispatch(loginAction(userData));
      dispatch(setInventoryCards(userCards));

      navigate("/");
      confetti.addConfetti().then(() => confetti.clearCanvas());
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="xs">
      <Box>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Welcome back !
        </Typography>
        {error && (
          <Alert sx={{ mt: 4 }} severity="error">
            {error}
          </Alert>
        )}
        <form onSubmit={submit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Box>
      {loading && <Loader overlay={loading} />}
    </Container>
  );
}
