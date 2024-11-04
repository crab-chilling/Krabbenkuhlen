import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import socketHandler from './sockets/socket.js';
import messageRoutes from './routes/messageRoutes.js';
import MessageConsumer from './consumers/MessageConsumer.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middlewares
app.use(express.json());
app.use(express.static('www'))

// Routes
app.use('/api', messageRoutes);

// Websocket
socketHandler(io);

// Consumers
const messageConsumer = new MessageConsumer(io);
messageConsumer.start();

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
