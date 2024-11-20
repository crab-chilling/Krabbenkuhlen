import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
  if (!socket) {
    socket = io('http://localhost:3000', {
      transports: ['websocket'],
      withCredentials: true,
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};