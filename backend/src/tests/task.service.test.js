// Jest globals are available without import in Node.js environment
import mongoose from 'mongoose';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import {
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} from '../services/task.service.js';

const TEST_DB_URI = 'mongodb://localhost:27017/taskmanager_test';

describe('Task Service', () => {
  let testUser;
  let testUser2;

  beforeAll(async () => {
    await mongoose.connect(TEST_DB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Task.deleteMany({});
    await User.deleteMany({});

    // Create test users
    testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    await testUser.save();

    testUser2 = new User({
      name: 'Test User 2',
      email: 'test2@example.com',
      password: 'password123',
    });
    await testUser2.save();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date('2024-12-31'),
        priority: 'High',
        status: 'To Do',
        creatorId: testUser._id,
      };

      const task = await createTask(taskData);

      expect(task).toBeDefined();
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test Description');
      expect(task.priority).toBe('High');
      expect(task.status).toBe('To Do');
      expect(task.creatorId._id.toString()).toBe(testUser._id.toString());
    });

    it('should fail when title exceeds 100 characters', async () => {
      const taskData = {
        title: 'A'.repeat(101),
        description: 'Test Description',
        dueDate: new Date('2024-12-31'),
        priority: 'Medium',
        status: 'To Do',
        creatorId: testUser._id,
      };

      await expect(createTask(taskData)).rejects.toThrow();
    });
  });

  describe('updateTask', () => {
    it('should update task status and trigger change detection', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date('2024-12-31'),
        priority: 'Medium',
        status: 'To Do',
        creatorId: testUser._id,
      };

      const createdTask = await createTask(taskData);
      const updateData = { status: 'In Progress' };

      const { task, changes } = await updateTask(
        createdTask._id.toString(),
        updateData,
        testUser._id.toString()
      );

      expect(task.status).toBe('In Progress');
      expect(changes.statusChanged).toBe(true);
    });

    it('should update task assignee and trigger change detection', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date('2024-12-31'),
        priority: 'Medium',
        status: 'To Do',
        creatorId: testUser._id,
      };

      const createdTask = await createTask(taskData);
      const updateData = { assignedToId: testUser2._id.toString() };

      const { task, changes } = await updateTask(
        createdTask._id.toString(),
        updateData,
        testUser._id.toString()
      );

      expect(task.assignedToId._id.toString()).toBe(testUser2._id.toString());
      expect(changes.assigneeChanged).toBe(true);
      expect(changes.newAssignedToId).toBe(testUser2._id.toString());
    });

    it('should throw error when non-creator tries to update', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date('2024-12-31'),
        priority: 'Medium',
        status: 'To Do',
        creatorId: testUser._id,
      };

      const createdTask = await createTask(taskData);
      const updateData = { status: 'Completed' };

      await expect(
        updateTask(
          createdTask._id.toString(),
          updateData,
          testUser2._id.toString() // Different user
        )
      ).rejects.toThrow('Not authorized');
    });
  });

  describe('deleteTask', () => {
    it('should delete task when creator deletes it', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date('2024-12-31'),
        priority: 'Medium',
        status: 'To Do',
        creatorId: testUser._id,
      };

      const createdTask = await createTask(taskData);
      await deleteTask(createdTask._id.toString(), testUser._id.toString());

      await expect(getTaskById(createdTask._id.toString())).rejects.toThrow('Task not found');
    });

    it('should throw error when non-creator tries to delete', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date('2024-12-31'),
        priority: 'Medium',
        status: 'To Do',
        creatorId: testUser._id,
      };

      const createdTask = await createTask(taskData);

      await expect(
        deleteTask(createdTask._id.toString(), testUser2._id.toString())
      ).rejects.toThrow('Not authorized');
    });
  });
});
