import { Typography, Grid, Box } from "@mui/material";
import ShopIcon from "@mui/icons-material/Shop";
import DrawIcon from "@mui/icons-material/Draw";
import SellIcon from "@mui/icons-material/Sell";
import BookIcon from "@mui/icons-material/Book";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import { NavigationItem } from "../types";
import NavigationCard from "../components/Home/NavigationCard";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

export default function Home() {
  const links: Array<NavigationItem> = [
    {
      label: "Encyclopedia",
      icon: <BookIcon />,
      description: "Discover all the cards mady by the community.",
      to: "/encyclopedia",
    },
    {
      label: "Inventory",
      icon: <CollectionsBookmarkIcon />,
      description: "View your own card collection.",
      to: "/inventory",
    },
    {
      label: "Buy",
      icon: <ShopIcon />,
      description: "Buy a new card from the store.",
      to: "/market",
    },
    {
      label: "Sell",
      icon: <SellIcon />,
      description: "Sell one of your card in the store.",
      to: "/sell",
    },
    {
      label: "Generate",
      icon: <DrawIcon />,
      description: "Generate a new card from scratch.",
      to: "/generator",
    },
    {
      label: "Play",
      icon: <SportsEsportsIcon />,
      description:
        "Join a room and compete against another player in real time.",
      to: "/lobby",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        gutterBottom
        variant="h2"
        component="div"
        sx={{ marginTop: "5vh" }}
      >
        Welcome to <s>Crab</s> Card Generator.
      </Typography>
      <Grid
        sx={{ marginTop: "2vh", width: "80%" }}
        container
        spacing={2}
        justifyContent="center"
      >
        {links.map((item) => (
          <Grid item xs={12} md={6} key={item.label}>
            <NavigationCard navigationItem={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
