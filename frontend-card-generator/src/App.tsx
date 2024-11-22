import "./App.css";

import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./views/Home";
import Login from "./views/Login";
import Register from "./views/Register";
import NotFound from "./views/NotFound";
import Footer from "./components/Footer";
import { Box } from "@mui/material";
import Encyclopedia from "./views/Encyclopedia";
import PrivateRoute from "./guards/PrivateRoute";
import Sell from "./views/Sell";
import Market from "./views/Market";
import { ToastContainer } from "react-toastify";
import Inventory from "./views/Inventory";
import Generator from "./views/Generator";
import Room from "./views/Room";
import Lobby from "./views/Lobby";

function App() {
  return (
    <>
      <Header />
      <Box sx={{ mx: 2, mt: 5 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/encyclopedia" element={<Encyclopedia />} />
          <Route path="/market" element={<Market />} />
          <Route element={<PrivateRoute />}>
            <Route path="/sell" element={<Sell />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/inventory" element={<Inventory />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/generator" element={<Generator />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/lobby" element={<Lobby />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/room/:id" element={<Room />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default App;
