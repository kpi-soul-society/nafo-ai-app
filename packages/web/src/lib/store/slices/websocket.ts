import { StateCreator } from 'zustand';

// FIXME: there's probably a better way to handle websockets on the frontend
export interface SocketState {
  isSocketOpen?: boolean;
  socketData?: any;
}

export interface WebSocketSlice {
  websocket: SocketState;
  dispatchSocketConnectionOpen: () => void;
  dispatchSocketConnectionClosed: () => void;
  dispatchSocketMessageReceived: (socketData: any) => void;
}

export const createWebSocketSlice: StateCreator<WebSocketSlice> = (set) => ({
  websocket: {
    isConnected: false,
    socketData: {},
  },
  dispatchSocketConnectionOpen: async () => {
    set({ websocket: { isSocketOpen: true } });
  },
  dispatchSocketConnectionClosed: async () => {
    set({ websocket: { isSocketOpen: false } });
  },
  dispatchSocketMessageReceived: async (socketData: any) => {
    set((state) => ({
      websocket: {
        socketData: { ...state.websocket.socketData, ...socketData },
      },
    }));
  },
});
