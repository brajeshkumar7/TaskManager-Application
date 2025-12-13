import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useSocketStore } from '../store/socket.store.js';

export const NotificationProvider = ({ children }) => {
  const { notifications, removeNotification } = useSocketStore();

  useEffect(() => {
    notifications.forEach((notification, index) => {
      if (notification.message) {
        toast.success(notification.message, {
          id: `notification-${index}`,
          duration: 5000,
        });
        removeNotification(index);
      }
    });
  }, [notifications, removeNotification]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 3000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      {children}
    </>
  );
};
