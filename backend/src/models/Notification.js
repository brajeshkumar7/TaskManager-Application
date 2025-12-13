import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Notification type is required'],
      enum: ['TASK_ASSIGNED', 'TASK_UPDATED', 'TASK_COMPLETED'],
      default: 'TASK_ASSIGNED',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Task ID is required'],
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);
