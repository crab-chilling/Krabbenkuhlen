import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import { createStore } from "redux";
import globalReducer from "./store/reducers";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

const store = createStore(globalReducer);

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff6d4e",
      contrastText: "#ffffff",
    },
  },
});

createRoot(document.getElementById("root")!).render(
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>,
);
