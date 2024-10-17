import { Card as CardType } from "../../types/card";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import OfflineBoltRoundedIcon from "@mui/icons-material/OfflineBoltRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import SportsMmaRoundedIcon from "@mui/icons-material/SportsMmaRounded";

interface Props {
  card: CardType;
}

export default function CardDetails({ card }: Props) {
  return (
    <Card className="pt-3 pb-0">
      <CardMedia
        component="img"
        sx={{ height: 140, width: "100%", objectFit: "contain" }}
        image={card.imgUrl}
        alt={card.name}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          className="text-center"
        >
          {card.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {card.description}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: "0.5vh" }}>
          <strong>Family:</strong> {card.family}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Affinity:</strong> {card.affinity}
        </Typography>
        <Grid container spacing={2} sx={{ mt: "0.5vh" }}>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center">
              <OfflineBoltRoundedIcon className="mr-1" />
              <Typography variant="body2" color="text.secondary">
                <strong>Energy:</strong> {card.energy.toFixed(2)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center">
              <FavoriteRoundedIcon className="mr-1" />
              <Typography variant="body2" color="text.secondary">
                <strong>Health:</strong> {card.hp.toFixed(2)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center">
              <SportsMmaRoundedIcon className="mr-1" />
              <Typography variant="body2" color="text.secondary">
                <strong>Attack:</strong> {card.attack.toFixed(2)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center">
              <ShieldRoundedIcon className="mr-1" />
              <Typography variant="body2" color="text.secondary">
                <strong>Defence:</strong> {card.defence.toFixed(2)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
