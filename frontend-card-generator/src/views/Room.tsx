import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import Chat from "../components/Room/Chat";

export default function Room() {
  const { id } = useParams();

  return (
    <Grid container>
      <Grid item xs={3}>
        <Chat currentUser="Lilian Andres" />
      </Grid>
      <Grid item xs={9}>
        {/* Code goes here */}
      </Grid>
    </Grid>
  );
}
