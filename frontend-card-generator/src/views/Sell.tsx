import { useState } from "react";
import { Card } from "../types/card";
import { Grid } from "@mui/material";
import CardTable from "../components/Card/CardTable";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import { isUserAuthenticated, selectUserAccount } from "../store/selectors/user.selectors";
import CardDetails from "../components/Card/CardDetails";
import ActionButton from "../components/Buttons/ActionButton";
import SellIcon from "@mui/icons-material/Sell";
import { sellCard } from "../api/market";
import { toast } from "react-toastify";
import { selectInventoryCards } from "../store/selectors/inventory.selectors";
import { deleteInventoryCard } from "../store/actions/inventory.actions";
import { useDispatch } from "react-redux";
import { updateUserAccountAction } from "../store/actions/user.actions";

export default function Sell() {
  const isAuthenticated = useSelector(isUserAuthenticated);
  const userCards = useSelector(selectInventoryCards);
  const userMoney = useSelector(selectUserAccount);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const handleCardSelect = (card: Card) => {
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
      dispatch(deleteInventoryCard(card.id))
      dispatch(updateUserAccountAction(userMoney + card.price));
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
