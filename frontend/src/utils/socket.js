import { io } from 'socket.io-client';
const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '/';

let socket = null;

export const initializeSocket = (token) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(BASE_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
