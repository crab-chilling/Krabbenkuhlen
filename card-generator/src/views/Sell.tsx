import { useState } from "react";
import { Card } from "../types/card";
import { Grid } from "@mui/material";
import CardTable from "../components/Card/CardTable";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import { isUserAuthenticated } from "../store/selectors/user.selectors";
import CardDetails from "../components/Card/CardDetails";
import ActionButton from "../components/Buttons/ActionButton";
import SellIcon from "@mui/icons-material/Sell";
import { sellCard } from "../api/market";
import { toast } from "react-toastify";
import { selectInventoryCards } from "../store/selectors/inventory.selectors";

export default function Sell() {
  const isAuthenticated = useSelector(isUserAuthenticated);
  const userCards = useSelector(selectInventoryCards);

  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardSelect = (card) => {
    setSelectedCard(card);
  };

  const onSellButtonClick = (card: Card) => {
    sell(card);
  };

  async function sell(card: Card) {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      await sellCard(card.userId, card.id);
      toast.success("Your card has been sold!");
    } catch {
      toast.error("An error occured...");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={selectedCard ? 9 : 12}>
        <CardTable cards={userCards} onSelectCard={handleCardSelect} />
        {loading && <Loader />}
      </Grid>
      {selectedCard && (
        <Grid item xs={3}>
          <CardDetails card={selectedCard} />
          <ActionButton
            size="large"
            sx={{ width: "100%", mt: 2 }}
            onClick={() => onSellButtonClick(selectedCard)}
          >
            <SellIcon />
            Sell ({selectedCard.price}$)
          </ActionButton>
        </Grid>
      )}
    </Grid>
  );
}
