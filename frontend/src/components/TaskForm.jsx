import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userAPI } from '../api/user.api.js';
import useSWR from 'swr';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  status: z.enum(['To Do', 'In Progress', 'Review', 'Completed']),
  assignedToId: z.string().optional().nullable(),
});

export const TaskForm = ({ task, onSubmit, onCancel }) => {
  const { data: usersData } = useSWR('/users', () => userAPI.getAll());
  const users = usersData?.users || [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        priority: task.priority,
        status: task.status,
        assignedToId: task.assignedToId?._id || task.assignedToId?.id || '',
      }
      : {
        priority: 'Medium',
        status: 'To Do',
        assignedToId: '',
      },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        priority: task.priority,
        status: task.status,
        assignedToId: task.assignedToId?._id || task.assignedToId?.id || '',
      });
    }
  }, [task, reset]);

  const onSubmitForm = async (data) => {
    const submitData = {
      ...data,
      assignedToId: data.assignedToId || null,
    };
    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('title')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Due Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          {...register('dueDate')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.dueDate && (
          <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            {...register('priority')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assign To
        </label>
        <select
          {...register('assignedToId')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user._id || user.id} value={user._id || user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {errors.assignedToId && (
          <p className="mt-1 text-sm text-red-600">{errors.assignedToId.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};
