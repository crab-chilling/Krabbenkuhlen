// src/context/socket.actions.ts

import { Socket } from 'socket.io-client';

export const SOCKET_CONNECT = 'SOCKET_CONNECT';
export const SOCKET_DISCONNECT = 'SOCKET_DISCONNECT';
export const SET_SOCKET = 'SET_SOCKET';
export const SET_CONNECTED = 'SET_CONNECTED';
export const MATCH_FOUND = 'MATCH_FOUND';
export const ATTACK_RESULT = 'ATTACK_RESULT';
export const JOIN_ROOM_SUCCESS = 'JOIN_ROOM_SUCCESS';

export interface SocketConnectAction {
  type: typeof SOCKET_CONNECT;
}

export interface SocketDisconnectAction {
  type: typeof SOCKET_DISCONNECT;
}

export interface SetSocketAction {
  type: typeof SET_SOCKET;
  payload: Socket;
}

export interface SetConnectedAction {
  type: typeof SET_CONNECTED;
  payload: boolean;
}

export interface MatchFoundAction {
  type: typeof MATCH_FOUND;
  payload: { roomId: string; players: string[] };
}

export interface AttackResultAction {
  type: typeof ATTACK_RESULT;
  payload: { damage: number; targetCardHp: number };
}

export interface JoinRoomSuccessAction {
  type: typeof JOIN_ROOM_SUCCESS;
  payload: { roomId: string };
}

export type SocketActionTypes =
  | SocketConnectAction
  | SocketDisconnectAction
  | SetSocketAction
  | SetConnectedAction
  | MatchFoundAction
  | AttackResultAction
  | JoinRoomSuccessAction;

// Action Creators
export const socketConnect = (): SocketConnectAction => ({
  type: SOCKET_CONNECT,
});

export const socketDisconnect = (): SocketDisconnectAction => ({
  type: SOCKET_DISCONNECT,
});

export const setSocket = (socket : Socket): SetSocketAction => ({
  type: SET_SOCKET,
  payload: socket,
});

export const setConnected = (connected: boolean): SetConnectedAction => ({
  type: SET_CONNECTED,
  payload: connected,
});

export const matchFound = (data: { roomId: string; players: string[] }): MatchFoundAction => ({
  type: MATCH_FOUND,
  payload: data,
});

export const attackResult = (data: { damage: number; targetCardHp: number }): AttackResultAction => ({
  type: ATTACK_RESULT,
  payload: data,
});

export const joinRoomSuccess = (data: { roomId: string }): JoinRoomSuccessAction => ({
  type: JOIN_ROOM_SUCCESS,
  payload: data,
});
