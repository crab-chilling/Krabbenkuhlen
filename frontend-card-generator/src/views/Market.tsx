import { useEffect, useState } from "react";
import { Card } from "../types/card";
import { Grid, Tooltip } from "@mui/material";
import CardTable from "../components/Card/CardTable";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import {
  isUserAuthenticated,
  selectUserAccount,
  selectUserId,
} from "../store/selectors/user.selectors";
import CardDetails from "../components/Card/CardDetails";
import ActionButton from "../components/Buttons/ActionButton";
import { buyCard, fetchMarketCards } from "../api/market";
import { toast } from "react-toastify";
import { addInventoryCard } from "../store/actions/inventory.actions";
import { updateUserAccountAction } from "../store/actions/user.actions";
import { useDispatch } from "react-redux";

export default function Market() {
  const isAuthenticated = useSelector(isUserAuthenticated);
  const userId = useSelector(selectUserId);
  const userAccount = useSelector(selectUserAccount);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [cards, setCards] = useState<Array<Card>>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const hasEnoughMoney = selectedCard
    ? selectedCard.price <= userAccount
    : false;

  const tooltipMessage = !isAuthenticated
    ? "You must be logged in to buy this card."
    : !hasEnoughMoney
      ? "You do not have enough money to buy this card."
      : "";

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
  };

  const onBuyButtonClick = (card: Card) => {
    buy(card);
  };

  async function buy(card: Card) {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      await buyCard(userId, card.id);
      dispatch(updateUserAccountAction(userAccount - card.price));
      dispatch(addInventoryCard(card));
      toast.success("Successful purchage");
    } catch {
      toast.error("An error occured...");
    } finally {
      setLoading(false);
    }
  }

  async function getMarketCards() {
    setLoading(true);
    try {
      setCards(await fetchMarketCards());
    } catch {
      toast.error("An error occured while fetching cards");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMarketCards();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={selectedCard ? 9 : 12}>
        <CardTable cards={cards} onSelectCard={handleCardSelect} />
        {loading && <Loader />}
      </Grid>
      {selectedCard && (
        <Grid item xs={3}>
          <CardDetails card={selectedCard} />
          <Tooltip title={tooltipMessage} arrow>
            <span>
              <ActionButton
                size="large"
                sx={{ width: "100%", mt: 2 }}
                disabled={!isAuthenticated || !hasEnoughMoney}
                onClick={() => onBuyButtonClick(selectedCard)}
              >
                <ShoppingCartIcon />
                Buy ({selectedCard.price}$)
              </ActionButton>
            </span>
          </Tooltip>
        </Grid>
      )}
    </Grid>
  );
}
