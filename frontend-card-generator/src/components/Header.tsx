import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CasinoIcon from "@mui/icons-material/Casino";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  isUserAuthenticated,
  selectUserAccount,
  selectUserLastName,
  selectUserSurname,
} from "../store/selectors/user.selectors";
import { logoutAction } from "../store/actions/user.actions";

export default function Header() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(isUserAuthenticated);
  const userLastName = useSelector(selectUserLastName);
  const userSurname = useSelector(selectUserSurname);
  const userAccount = useSelector(selectUserAccount);

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <CasinoIcon sx={{ color: "white" }} />
          <Typography
            variant="h6"
            onClick={() => navigate("/")}
            sx={{ ml: 1, flexGrow: 1, cursor: "pointer", color: "white" }}
          >
            Card Generator
          </Typography>
          {isAuthenticated ? (
            <>
              <Typography sx={{ color: "white", mr: 2 }}>
                {userLastName} {userSurname} - Wallet: {userAccount.toFixed(2)} $
              </Typography>
              <Button sx={{ color: "white" }} onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/register">
                <Button sx={{ color: "white" }} color="inherit">
                  Register
                </Button>
              </Link>
              <Link to="/login">
                <Button sx={{ color: "white" }} color="inherit">
                  Login
                </Button>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
