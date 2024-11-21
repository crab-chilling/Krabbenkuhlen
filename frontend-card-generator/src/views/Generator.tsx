import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { generateCard } from "../api/card.ts";
import { useSelector } from "react-redux";
import { selectUserId } from "../store/selectors/user.selectors";

export default function Generator() {
  const userId = useSelector(selectUserId);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!image || !description || !termsAccepted) {
      setError(
        "Please fill in all fields and accept the terms and conditions.",
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      const newCard = { image, description };
      await generateCard(userId, newCard.image, newCard.description);
      toast.success("The generation of your card has started.");

      setImage("");
      setDescription("");
      setTermsAccepted(false);
    } catch (e) {
      toast.success("An error occured, try again later.");
      console.log("Error: ", e)
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Box>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Generate Your Card
        </Typography>
        {error && (
          <Alert sx={{ mt: 4 }} severity="error">
            {error}
          </Alert>
        )}
        <form onSubmit={submit}>
          <TextField
            multiline
            rows={2}
            maxRows={4}
            fullWidth
            label="Image prompt"
            variant="outlined"
            margin="normal"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            maxRows={4}
            label="Description prompt"
            variant="outlined"
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Box>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label style={{ marginLeft: 8 }}>
              I accept the terms and conditions
            </label>
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Generate Card
          </Button>
        </form>
      </Box>
      {loading && <Loader overlay={loading} />}
    </Container>
  );
}
