import express from "express";
import http from "http";
import { Server } from "socket.io";
import chatSocket from "./sockets/chatSocket.js";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

// Middlewares
// app.use(express.json());
app.use(express.static("www"));

// Routes
app.get("/health-check", (req, res) => {
  res.send("UP");
});

// Websocket
chatSocket(io);

// Consumers

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
