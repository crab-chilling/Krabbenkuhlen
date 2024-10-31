import { Card, CardContent, Typography, CardActionArea } from "@mui/material";
import { NavigationItem } from "../../types";
import { useNavigate } from "react-router-dom";

interface Props {
  navigationItem: NavigationItem;
}

export default function NavigationCard({ navigationItem }: Props) {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        width: "100%",
        height: "15vh",
        backgroundColor: "primary.main",
        color: "white",
      }}
    >
      <CardActionArea onClick={() => navigate(navigationItem.to)}>
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ display: "flex", alignItems: "center" }}
          >
            {navigationItem.icon}
            <span style={{ marginLeft: 8 }}>{navigationItem.label}</span>
          </Typography>
          <Typography variant="body2" color="white">
            {navigationItem.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
