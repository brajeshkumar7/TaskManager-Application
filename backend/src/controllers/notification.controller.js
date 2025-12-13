import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from '../services/notification.service.js';

export const getAll = async (req, res, next) => {
  try {
    const { read } = req.query;
    const filters = {};

    if (read !== undefined) {
      filters.read = read === 'true';
    }

    const notifications = await getUserNotifications(req.user._id, filters);
    const unreadCount = await getUnreadCount(req.user._id);

    res.status(200).json({
      notifications,
      unreadCount,
      total: notifications.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getUnread = async (req, res, next) => {
  try {
    const unreadCount = await getUnreadCount(req.user._id);
    res.status(200).json({ unreadCount });
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req, res, next) => {
  try {
    const notification = await markAsRead(req.params.id, req.user._id);
    res.status(200).json({
      message: 'Notification marked as read',
      notification,
    });
  } catch (error) {
    next(error);
  }
};

export const markAllRead = async (req, res, next) => {
  try {
    await markAllAsRead(req.user._id);
    res.status(200).json({
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deleteNotification(req.params.id, req.user._id);
    res.status(200).json({
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const removeAll = async (req, res, next) => {
  try {
    await deleteAllNotifications(req.user._id);
    res.status(200).json({
      message: 'All notifications deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
