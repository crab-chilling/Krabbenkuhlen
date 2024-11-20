// src/context/socket.selectors.ts

import { SocketState } from '../reducers/socket.reducer.ts';

export const selectSocket = (state: { socket: SocketState }) => state.socket.socket;
export const selectSocketConnected = (state: { socket: SocketState }) => state.socket.connected;
export const selectRoomId = (state: { socket: SocketState }) => state.socket.roomId;
export const selectCurrentPlayer = (state: { socket: SocketState }) => state.socket.currentPlayer;
export const selectOpponent = (state: { socket: SocketState }) => state.socket.opponent;
export const selectAttackResult = (state: { socket: SocketState }) => state.socket.attackResult;
