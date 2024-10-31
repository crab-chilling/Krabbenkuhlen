import { useEffect, useState } from "react";
import { fetchAllCards } from "../api/card";
import { Card } from "../types/card";
import Loader from "../components/Loader";
import { Container, Grid } from "@mui/material";
import CardDetails from "../components/Card/CardDetails";
import { toast } from "react-toastify";

export default function Encyclopedia() {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<Array<Card>>([]);

  async function getAllCards() {
    setLoading(true);
    try {
      setCards(await fetchAllCards());
    } catch {
      toast.error("An error occured while fetching cards");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllCards();
  }, []);

  return (
    <Container>
      <Grid container spacing={1}>
        {cards.map((card) => (
          <Grid item key={card.id} xs={12} sm={6} md={4}>
            <CardDetails card={card} />
          </Grid>
        ))}
      </Grid>
      {loading && <Loader overlay={loading} />}
    </Container>
  );
}
