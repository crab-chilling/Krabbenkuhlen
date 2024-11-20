import { Grid } from "@mui/material";
import Chat from "../components/Room/Chat";
import Game from "../components/Room/Game";

export default function Room() {

  return (
    <Grid container>
      <Grid item xs={3}>
        <Chat currentUser="Lilian Andres" />
      </Grid>
      <Grid item xs={6}>
        <Game roomId={id}></Game>
      </Grid>
    </Grid>
  );
}
