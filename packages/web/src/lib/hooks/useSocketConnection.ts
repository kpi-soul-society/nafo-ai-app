import { useCallback, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { shallow } from 'zustand/shallow';

import { WEBSOCKET_ENDPOINT } from '../config/next';
import { useAppStore } from '../store';

const useSocketConnection = () => {
  const { data: session } = useSession();

  const socket = useRef<WebSocket | null>(null);
  const { dispatchSocketConnectionOpen, dispatchSocketConnectionClosed, dispatchSocketMessageReceived, isConnected } =
    useAppStore(
      (state) => ({
        isConnected: state.websocket.isSocketOpen,
        dispatchSocketConnectionOpen: state.dispatchSocketConnectionOpen,
        dispatchSocketConnectionClosed: state.dispatchSocketConnectionClosed,
        dispatchSocketMessageReceived: state.dispatchSocketMessageReceived,
      }),
      shallow
    );

  useEffect(() => {
    connectSocket();
  }, [isConnected, session?.user.accessToken]);

  const connectSocket = () => {
    if (socket.current?.readyState !== WebSocket.OPEN && session?.user.accessToken) {
      const SERVICE_URL = `${WEBSOCKET_ENDPOINT}?token=${session.user.accessToken}`;
      socket.current = new WebSocket(SERVICE_URL);
      socket.current.addEventListener('open', onSocketOpen);
      socket.current.addEventListener('close', onSocketClosed);
      socket.current.addEventListener('message', ({ data }) => {
        onSocketMessage(data);
      });
    }
  };

  //This function is used from the useSocketData hook :)
  const reconnectSocket = () => {
    connectSocket();
  };

  //Event listener to when the socket opens
  const onSocketOpen = useCallback(() => {
    dispatchSocketConnectionOpen();
  }, []);

  //Event listener to when the socket closes
  const onSocketClosed = useCallback(() => {
    dispatchSocketConnectionClosed();
  }, []);

  //Event listener to when the socket sends a message
  const onSocketMessage = useCallback((data: any) => {
    if (data !== '') {
      const socketData = JSON.parse(data);
      socketData.reconnectSocket = reconnectSocket;

      dispatchSocketMessageReceived(socketData);

      //If the socket sent a notification
      if (socketData?.notification) {
        const { title, description, type } = socketData.notification;
        //You can trigger a notification here.
        //title, description and type are things I send from the back-end.
        //You can basically send anything from the back-end and structure it as you want from here :)
      }
    }
  }, []);
};

export default useSocketConnection;
