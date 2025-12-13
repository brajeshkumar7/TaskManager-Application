import { useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { taskAPI } from '../api/task.api.js';

const fetcher = async (url) => {
  const [endpoint, ...params] = url.split('?');
  const queryParams = params.length > 0 ? Object.fromEntries(new URLSearchParams(params.join('?'))) : {};

  switch (endpoint) {
    case '/tasks':
      return taskAPI.getAll(queryParams);
    case '/tasks/my-created':
      return taskAPI.getMyCreated(queryParams);
    case '/tasks/my-assigned':
      return taskAPI.getMyAssigned(queryParams);
    case '/tasks/overdue':
      return taskAPI.getOverdue(queryParams);
    default:
      if (endpoint.startsWith('/tasks/')) {
        const id = endpoint.split('/')[2];
        return taskAPI.getOne(id);
      }
      throw new Error('Unknown endpoint');
  }
};

// Global cache invalidation on socket events
if (typeof window !== 'undefined') {
  window.addEventListener('task-updated', () => {
    // Invalidate all task-related SWR keys
    mutate((key) => typeof key === 'string' && key.startsWith('/tasks'));
  });
}

export const useTasks = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const { data, error, isLoading, mutate } = useSWR(
    `/tasks?${queryString}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    tasks: data?.tasks || [],
    count: data?.count || 0,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useMyCreatedTasks = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const { data, error, isLoading, mutate } = useSWR(
    `/tasks/my-created?${queryString}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    tasks: data?.tasks || [],
    count: data?.count || 0,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useMyAssignedTasks = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const { data, error, isLoading, mutate } = useSWR(
    `/tasks/my-assigned?${queryString}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    tasks: data?.tasks || [],
    count: data?.count || 0,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useOverdueTasks = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const { data, error, isLoading, mutate } = useSWR(
    `/tasks/overdue?${queryString}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    tasks: data?.tasks || [],
    count: data?.count || 0,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useTask = (id) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/tasks/${id}` : null,
    fetcher
  );

  return {
    task: data?.task,
    isLoading,
    isError: error,
    mutate,
  };
};
