import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { register } from "../api/user";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import JSConfetti from "js-confetti";
import { loginAction } from "../store/actions/user.actions";
import { useDispatch } from "react-redux";

export default function Register() {
  const confetti = new JSConfetti();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [lastName, setLastName] = useState("");
  const [surName, setSurName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !username ||
      !password ||
      !email ||
      !lastName ||
      !confirmPassword ||
      !surName
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const userData = await register(
        lastName,
        surName,
        username,
        email,
        password,
      );
      confetti.addConfetti().then(() => confetti.clearCanvas());
      dispatch(loginAction(userData));
      navigate("/");
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
          Become a crab !
        </Typography>
        {error && (
          <Alert sx={{ mt: 4 }} severity="error">
            {error}
          </Alert>
        )}
        <form onSubmit={submit}>
          <TextField
            label="Last name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            label="Surname"
            variant="outlined"
            fullWidth
            margin="normal"
            value={surName}
            onChange={(e) => setSurName(e.target.value)}
          />
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>
      </Box>
      {loading && <Loader overlay={loading} />}
    </Container>
  );
}
