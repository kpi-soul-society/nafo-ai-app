'use client';
import { createContext, useCallback, useContext, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { signOut, useSession } from 'next-auth/react';

import { WEBSOCKET_ENDPOINT } from '../config/next';

export interface WebSocketContext {
  socketData: any;
  reconnectWebSocket?: () => void;
}
const initialValues: WebSocketContext = {
  socketData: {},
};
export const WebSocketContext = createContext(initialValues);

// eslint-disable-next-line  @typescript-eslint/ban-types
export const WebSocketProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { data: session } = useSession({
    required: true,
    async onUnauthenticated() {
      await signOut({
        redirect: true,
      });
    },
  });

  const [socketData, setSocketData] = useState({});
  const [isConnected, setIsConnected] = useState(true);

  const reconnectWebSocket = useCallback(() => {
    setIsConnected(false);

    setTimeout(() => {
      setIsConnected(true);
    }, 2000);
  }, [isConnected]);

  useWebSocket(
    WEBSOCKET_ENDPOINT,
    {
      onMessage: (messageEvent) => {
        const data = messageEvent.data;
        if (data !== '' && data !== 'pong') {
          const incomingMessage = JSON.parse(data);

          setSocketData({ ...socketData, ...incomingMessage });
        }
      },
      retryOnError: true,
      shouldReconnect: (closeEvent) => true,
      reconnectAttempts: 20,
      //attemptNumber will be 0 the first time it attempts to reconnect, so this equation results in a reconnect pattern of 1 second, 2 seconds, 4 seconds, 8 seconds, and then caps at 10 seconds until the maximum number of attempts is reached
      reconnectInterval: (attemptNumber) => Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
      queryParams: {
        token: session?.user.accessToken as string,
      },
      heartbeat: {
        timeout: 15000,
        interval: 10000,
      },
    },
    isConnected
  );

  return <WebSocketContext.Provider value={{ socketData, reconnectWebSocket }}>{children}</WebSocketContext.Provider>;
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  return context;
};
