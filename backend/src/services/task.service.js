import { Task } from '../models/Task.js';

export const createTask = async (taskData) => {
  const task = new Task(taskData);
  await task.save();
  return await Task.findById(task._id).populate('creatorId', 'name email').populate('assignedToId', 'name email');
};

export const getAllTasks = async (filters = {}, sort = {}) => {
  const query = Task.find(filters)
    .populate('creatorId', 'name email')
    .populate('assignedToId', 'name email')
    .sort(sort);

  return await query.exec();
};

export const getTaskById = async (taskId) => {
  const task = await Task.findById(taskId)
    .populate('creatorId', 'name email')
    .populate('assignedToId', 'name email');

  if (!task) {
    throw new Error('Task not found');
  }

  return task;
};

export const updateTask = async (taskId, updateData, userId) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error('Task not found');
  }

  // Check if user is creator or assigned user
  if (task.creatorId.toString() !== userId.toString() && task.assignedToId?.toString() !== userId.toString()) {
    throw new Error('Not authorized to update this task');
  }

  // Track changes for socket events
  const oldStatus = task.status;
  const oldPriority = task.priority;
  const oldAssignedToId = task.assignedToId?.toString();

  Object.assign(task, updateData);
  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate('creatorId', 'name email')
    .populate('assignedToId', 'name email');

  return {
    task: updatedTask,
    changes: {
      statusChanged: oldStatus !== updatedTask.status,
      priorityChanged: oldPriority !== updatedTask.priority,
      assigneeChanged: oldAssignedToId !== updatedTask.assignedToId?.toString(),
      oldAssignedToId,
      newAssignedToId: updatedTask.assignedToId?.toString(),
    },
  };
};

export const deleteTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error('Task not found');
  }

  // Only creator can delete
  if (task.creatorId.toString() !== userId.toString()) {
    throw new Error('Not authorized to delete this task');
  }

  await Task.findByIdAndDelete(taskId);
  return { message: 'Task deleted successfully' };
};

export const getTasksByCreator = async (creatorId, filters = {}, sort = {}) => {
  return await getAllTasks({ creatorId, ...filters }, sort);
};

export const getTasksByAssignee = async (assigneeId, filters = {}, sort = {}) => {
  return await getAllTasks({ assignedToId: assigneeId, ...filters }, sort);
};

export const getOverdueTasks = async (userId = null, filters = {}, sort = {}) => {
  const query = {
    dueDate: { $lt: new Date() },
    status: { $ne: 'Completed' },
    ...filters,
  };

  if (userId) {
    query.$or = [
      { creatorId: userId },
      { assignedToId: userId },
    ];
  }

  return await getAllTasks(query, sort);
};
