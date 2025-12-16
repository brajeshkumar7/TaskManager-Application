import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '../hooks/useNotifications.js';
import { notificationAPI } from '../api/notification.api.js';
import { useAuthStore } from '../store/auth.store.js';
import { NotificationBell } from '../components/NotificationBell.jsx';
import { ProfileDropdown } from '../components/ProfileDropdown.jsx';
import toast from 'react-hot-toast';

export const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const { notifications, unreadCount, isLoading, mutate } = useNotifications({
    read: filter === 'all' ? undefined : filter === 'unread' ? 'false' : 'true',
  });

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      toast.success('Notification marked as read');
      mutate();
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      toast.success('All notifications marked as read');
      mutate();
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationAPI.delete(id);
      toast.success('Notification deleted');
      mutate();
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete all notifications?')) {
      return;
    }
    try {
      await notificationAPI.deleteAll();
      toast.success('All notifications deleted');
      mutate();
    } catch (error) {
      toast.error('Failed to delete all notifications');
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification._id);
    }
    navigate(`/tasks`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <nav className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Task Manager
            </h1>
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-white/80 hover:text-white font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/tasks"
                className="text-white/80 hover:text-white font-medium transition-colors"
              >
                All Tasks
              </Link>
              <ProfileDropdown />
              <NotificationBell />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Mark All as Read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleDeleteAll}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete All
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm rounded-md ${filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 text-sm rounded-md ${filter === 'unread'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 text-sm rounded-md ${filter === 'read'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Read ({notifications.length - unreadCount})
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No notifications found
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        {!notification.read && (
                          <div className="mt-1 h-2 w-2 bg-blue-600 rounded-full"></div>
                        )}
                        <div className="flex-1">
                          <p className="text-gray-800">{notification.message}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                          {notification.taskId && (
                            <p className="text-xs text-gray-400 mt-1">
                              Task: {notification.taskId.title}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
