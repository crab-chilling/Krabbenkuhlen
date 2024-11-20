import { Socket } from 'socket.io-client';
import { SocketActionTypes, SET_SOCKET, SET_CONNECTED, MATCH_FOUND, ATTACK_RESULT, JOIN_ROOM_SUCCESS } from '../actions/socket.actions';

export interface SocketState {
  socket: Socket | null;
  connected: boolean;
  roomId: string | null;
  currentPlayer: string | null;
  opponent: string | null;
  attackResult: {
    damage: number;
    targetCardHp: number;
  } | null;
}

const initialState: SocketState = {
  socket: null,
  connected: false,
  roomId: null,
  currentPlayer: null,
  opponent: null,
  attackResult: null,
};

export const socketReducer = (state = initialState, action: SocketActionTypes): SocketState => {
  switch (action.type) {
    case SET_SOCKET:
      return {
        ...state,
        socket: action.payload,
      };
    case SET_CONNECTED:
      return {
        ...state,
        connected: action.payload,
      };
    case MATCH_FOUND:
      const { roomId, players } = action.payload;
      const currentPlayer = players.find(player => player === state.socket?.id) || null;
      const opponent = players.find(player => player !== state.socket?.id) || null;
      return {
        ...state,
        roomId,
        currentPlayer,
        opponent,
      };
    case ATTACK_RESULT:
      return {
        ...state,
        attackResult: action.payload,
      };
    case JOIN_ROOM_SUCCESS:
      return {
        ...state,
        roomId: action.payload.roomId,
      };
    default:
      return state;
  }
};
