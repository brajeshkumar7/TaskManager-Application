import mongoose from 'mongoose';

const priorityEnum = ['Low', 'Medium', 'High', 'Urgent'];
const statusEnum = ['To Do', 'In Progress', 'Review', 'Completed'];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    priority: {
      type: String,
      enum: priorityEnum,
      required: [true, 'Priority is required'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: statusEnum,
      required: [true, 'Status is required'],
      default: 'To Do',
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator ID is required'],
    },
    assignedToId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
taskSchema.index({ creatorId: 1 });
taskSchema.index({ assignedToId: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });

export const Task = mongoose.model('Task', taskSchema);
