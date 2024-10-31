import { useEffect, useState } from "react";
import { Card } from "../types/card";
import Loader from "../components/Loader";
import { Container, Grid } from "@mui/material";
import CardDetails from "../components/Card/CardDetails";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { isUserAuthenticated } from "../store/selectors/user.selectors";
import { selectInventoryCards } from "../store/selectors/inventory.selectors";

export default function Inventory() {
  const isAuthenticated = useSelector(isUserAuthenticated);
  const userCards = useSelector(selectInventoryCards);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("You must be logged in to view your cards.");
    }
  }, [isAuthenticated]);

  return (
    <Container>
      <Grid container spacing={1}>
        {loading && <Loader overlay={loading} />}
        {!loading &&
          userCards.map((card: Card) => (
            <Grid item key={card.id} xs={12} sm={6} md={4}>
              <CardDetails card={card} />
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}
