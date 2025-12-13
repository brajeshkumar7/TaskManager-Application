import { Notification } from '../models/Notification.js';

export const createNotification = async (notificationData) => {
  const notification = new Notification(notificationData);
  await notification.save();
  return await Notification.findById(notification._id)
    .populate('taskId', 'title description status priority')
    .populate('userId', 'name email');
};

export const getUserNotifications = async (userId, filters = {}) => {
  const query = { userId, ...filters };
  return await Notification.find(query)
    .populate('taskId', 'title description status priority dueDate')
    .sort({ createdAt: -1 })
    .limit(50);
};

export const getUnreadCount = async (userId) => {
  return await Notification.countDocuments({ userId, read: false });
};

export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    userId,
  });

  if (!notification) {
    throw new Error('Notification not found');
  }

  notification.read = true;
  notification.readAt = new Date();
  await notification.save();

  return notification;
};

export const markAllAsRead = async (userId) => {
  return await Notification.updateMany(
    { userId, read: false },
    { read: true, readAt: new Date() }
  );
};

export const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    userId,
  });

  if (!notification) {
    throw new Error('Notification not found');
  }

  return notification;
};

export const deleteAllNotifications = async (userId) => {
  return await Notification.deleteMany({ userId });
};
