import { create } from 'zustand';

import { createWebSocketSlice, WebSocketSlice } from './slices/websocket';

type StoreState = WebSocketSlice;

export const useAppStore = create<StoreState>()((...a) => ({
  ...createWebSocketSlice(...a),
}));
