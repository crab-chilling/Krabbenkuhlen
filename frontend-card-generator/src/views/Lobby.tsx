import { useState, useEffect, useContext } from "react";
import { Button, Grid, Stack } from "@mui/material";
import CardTable from "../components/Card/CardTable";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import { selectInventoryCards } from "../store/selectors/inventory.selectors";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import {io, Socket} from "socket.io-client";

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  withCredentials: true
});

export default function Lobby() {
  const maxSelectionCards = 1;
  const navigate = useNavigate();
  const userCards = useSelector(selectInventoryCards);
  const [loading] = useState<boolean>(false);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  const handleSelectionChange = (selectedIds: number[]) => {
    setSelectedCards(selectedIds);
  };

  const handleJoinClick = () => {
    console.log("Joining the room...");
    socket.emit('findMatch');
    socket.on('joinRoom',(data) => {
      console.log(data)
      navigate("/room/" + data.roomId);
    })
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
