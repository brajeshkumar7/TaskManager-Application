import { create } from 'zustand';
import { io } from 'socket.io-client';

export const useSocketStore = create((set, get) => {
  let socket = null;

  return {
    socket: null,
    isConnected: false,
    notifications: [],

    connect: (token) => {
      if (socket?.connected) {
        return;
      }

      socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        auth: { token },
        transports: ['websocket', 'polling'],
      });

      socket.on('connect', () => {
        console.log('Socket connected');
        set({ socket, isConnected: true });
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        set({ isConnected: false });
      });

      socket.on('notification', (notification) => {
        const notifications = get().notifications;
        set({
          notifications: [...notifications, notification],
        });
      });

      socket.on('notification:new', (notification) => {
        // Trigger SWR revalidation for notifications
        window.dispatchEvent(new Event('notification-updated'));
        const notifications = get().notifications;
        set({
          notifications: [...notifications, notification],
        });
      });

      socket.on('task:created', (task) => {
        // Handle task created event
        console.log('Task created:', task);
      });

      socket.on('task:updated', ({ task, changes }) => {
        // Handle task updated event
        console.log('Task updated:', task, changes);
      });

      socket.on('task:deleted', ({ taskId }) => {
        // Handle task deleted event
        console.log('Task deleted:', taskId);
      });
    },

    disconnect: () => {
      if (socket) {
        socket.disconnect();
        socket = null;
        set({ socket: null, isConnected: false });
      }
    },

    addNotification: (notification) => {
      const notifications = get().notifications;
      set({ notifications: [...notifications, notification] });
    },

    removeNotification: (index) => {
      const notifications = get().notifications;
      notifications.splice(index, 1);
      set({ notifications });
    },

    clearNotifications: () => {
      set({ notifications: [] });
    },
  };
});
