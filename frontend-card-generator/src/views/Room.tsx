import { Grid } from "@mui/material";
import Chat from "../components/Room/Chat";
import Game from "../components/Room/Game";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectInventoryCards } from "../store/selectors/inventory.selectors";

export default function Room() {

  const location = useLocation();
  const { selectedCardIds} = location.state || {};

  const userCards = useSelector(selectInventoryCards);

  const selectedCards = userCards.filter((card) => selectedCardIds.includes(card.id))
  
  return (
    <Grid container>
      <Grid item xs={3}>
        <Chat currentUser="Lilian Andres" />
      </Grid>
      <Grid item xs={6}>
        <Game cards={selectedCards}></Game>
      </Grid>
    </Grid>
  );
}
