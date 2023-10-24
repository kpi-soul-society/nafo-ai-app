import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';

import { useAppStore } from '../store';

const useSocketData = () => {
  const { isConnected, socketData } = useAppStore(
    (state) => ({
      isConnected: state.websocket.isSocketOpen,
      socketData: state.websocket.socketData,
    }),
    shallow
  );

  //Reconnect if the socket was closed for some reason
  useEffect(() => {
    if (!isConnected) {
      try {
        socketData?.reconnectSocket();
      } catch (err) {
        // FIXME: Handle error
      }
    }
  }, [isConnected, socketData]);

  return {
    isConnected: isConnected,
    socketData: socketData,
  };
};

export default useSocketData;
