import { useEffect } from 'react';
import useSWR from 'swr';
import { notificationAPI } from '../api/notification.api.js';

const fetcher = async (url) => {
  if (url === '/notifications/unread') {
    return notificationAPI.getUnreadCount();
  }
  return notificationAPI.getAll();
};

export const useNotifications = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const { data, error, isLoading, mutate } = useSWR(
    `/notifications?${queryString}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  // Listen for socket events to revalidate
  useEffect(() => {
    const handleNotificationUpdate = () => {
      mutate();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('notification-updated', handleNotificationUpdate);
      return () => {
        window.removeEventListener('notification-updated', handleNotificationUpdate);
      };
    }
  }, [mutate]);

  return {
    notifications: data?.notifications || [],
    unreadCount: data?.unreadCount || 0,
    total: data?.total || 0,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useUnreadCount = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/notifications/unread',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  // Listen for socket events to revalidate
  useEffect(() => {
    const handleNotificationUpdate = () => {
      mutate();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('notification-updated', handleNotificationUpdate);
      return () => {
        window.removeEventListener('notification-updated', handleNotificationUpdate);
      };
    }
  }, [mutate]);

  return {
    unreadCount: data?.unreadCount || 0,
    isLoading,
    isError: error,
    mutate,
  };
};
