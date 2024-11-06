import express from "express";
import http from "http";
import { Server } from "socket.io";
import chatSocketHandler from "./sockets/chatSocket";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middlewares
// app.use(express.json());
app.use(express.static("www"));

// Routes
// app.use("/api", someRoute);

// Websocket
chatSocketHandler(io);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
