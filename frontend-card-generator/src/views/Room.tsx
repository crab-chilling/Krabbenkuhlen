import { Grid } from "@mui/material";
import Chat from "../components/Room/Chat";

export default function Room() {

  return (
    <Grid container>
      <Grid item xs={3}>
        <Chat />
      </Grid>
      <Grid item xs={9}>
        {/* Code goes here */}
      </Grid>
    </Grid>
  );
}
