import { useState, useEffect, useRef } from "react";
import { Button, Grid, Stack } from "@mui/material";
import CardTable from "../components/Card/CardTable";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import { selectUserId } from "../store/selectors/user.selectors";
import { selectUserLastName } from "../store/selectors/user.selectors";
import { selectUserSurname } from "../store/selectors/user.selectors";
import { selectInventoryCards } from "../store/selectors/inventory.selectors";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";



export default function Lobby() {
  const userId = useSelector(selectUserId);
  const userLastName = useSelector(selectUserLastName);
  const userSurname = useSelector(selectUserSurname);

  const maxSelectionCards = 1;
  const navigate = useNavigate();
  const userCards = useSelector(selectInventoryCards);
  const [loading] = useState<boolean>(false);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  const handleSelectionChange = (selectedIds: number[]) => {
    setSelectedCards(selectedIds);
  };


  const handleJoinClick = () => {
    navigate("/room/", {state : {selectedCardIds: selectedCards}});
  };

  
  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <CardTable
          cards={userCards}
          enableRowSelection={true}
          onSelectionChange={handleSelectionChange}
        />
        {loading && <Loader />}
      </Grid>
      <Grid item xs={3} container alignItems="stretch">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={selectedCards.length !== maxSelectionCards}
          onClick={handleJoinClick}
        >
          <Stack spacing={0.5} alignItems="center">
            <CheckIcon fontSize="large" />
            <span>Join a room</span>
            <span>
              Selection: {selectedCards.length}/{maxSelectionCards}
            </span>
          </Stack>
        </Button>
      </Grid>
    </Grid>
  );
}
