import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByCreator,
  getTasksByAssignee,
  getOverdueTasks,
} from '../services/task.service.js';
import { createTaskSchema, updateTaskSchema } from '../validators/task.dto.js';
import { createNotification } from '../services/notification.service.js';

export const create = async (req, res, next) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);
    const taskData = {
      ...validatedData,
      creatorId: req.user._id,
    };

    const task = await createTask(taskData);

    // Emit socket event for new task
    req.io.emit('task:created', task);

    // Create persistent notification if task is assigned to someone
    if (task.assignedToId && task.assignedToId._id.toString() !== req.user._id.toString()) {
      const notification = await createNotification({
        userId: task.assignedToId._id,
        type: 'TASK_ASSIGNED',
        message: `You have been assigned to task: ${task.title}`,
        taskId: task._id,
      });

      // Emit socket notification to the assigned user
      req.io.to(task.assignedToId._id.toString()).emit('notification:new', notification);
    }

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const { status, priority, sortBy = 'dueDate', sortOrder = 'asc' } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tasks = await getAllTasks(filters, sort);

    res.status(200).json({
      tasks,
      count: tasks.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const task = await getTaskById(req.params.id);
    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const validatedData = updateTaskSchema.parse(req.body);
    const { task, changes } = await updateTask(req.params.id, validatedData, req.user._id);

    // Emit socket events for real-time updates
    req.io.emit('task:updated', { task, changes });

    // Notifications on task updates are intentionally disabled to avoid
    // validation issues and noisy alerts while keeping task updates working
    // exactly the same for the user. Socket "task:updated" events still fire.

    res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deleteTask(req.params.id, req.user._id);

    // Emit socket event for task deletion
    req.io.emit('task:deleted', { taskId: req.params.id });

    res.status(200).json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getMyCreatedTasks = async (req, res, next) => {
  try {
    const { status, priority, sortBy = 'dueDate', sortOrder = 'asc' } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tasks = await getTasksByCreator(req.user._id, filters, sort);

    res.status(200).json({
      tasks,
      count: tasks.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyAssignedTasks = async (req, res, next) => {
  try {
    const { status, priority, sortBy = 'dueDate', sortOrder = 'asc' } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tasks = await getTasksByAssignee(req.user._id, filters, sort);

    res.status(200).json({
      tasks,
      count: tasks.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getOverdue = async (req, res, next) => {
  try {
    const { status, priority, sortBy = 'dueDate', sortOrder = 'asc' } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tasks = await getOverdueTasks(req.user._id, filters, sort);

    res.status(200).json({
      tasks,
      count: tasks.length,
    });
  } catch (error) {
    next(error);
  }
};
