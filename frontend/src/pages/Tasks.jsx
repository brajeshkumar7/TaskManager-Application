import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTasks } from '../hooks/useTasks.js';
import { taskAPI } from '../api/task.api.js';
import { TaskCard } from '../components/TaskCard.jsx';
import { TaskCardSkeleton, Loader } from '../components/Loader.jsx';
import { TaskForm } from '../components/TaskForm.jsx';
import { useAuthStore } from '../store/auth.store.js';
import { NotificationBell } from '../components/NotificationBell.jsx';
import { ProfileDropdown } from '../components/ProfileDropdown.jsx';

export const Tasks = () => {
  const { user } = useAuthStore();
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    sortBy: 'dueDate',
    sortOrder: 'asc',
  });
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { tasks, isLoading, mutate } = useTasks(filters);

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskAPI.delete(taskId);
      toast.success('Task deleted successfully');
      mutate();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete task');
    }
  };

  const handleSubmitTask = async (data) => {
    try {
      if (editingTask) {
        await taskAPI.update(editingTask._id, data);
        toast.success('Task updated successfully');
      } else {
        await taskAPI.create(data);
        toast.success('Task created successfully');
      }
      setShowModal(false);
      setEditingTask(null);
      mutate();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save task');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/tasks"
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                All Tasks
              </Link>
              <ProfileDropdown />
              <NotificationBell />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Tasks</h2>
          <button
            onClick={handleCreateTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            + Create Task
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
                <option value="createdAt">Created At</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
            No tasks found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {editingTask ? 'Edit Task' : 'Create Task'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingTask(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <TaskForm
              task={editingTask}
              onSubmit={handleSubmitTask}
              onCancel={() => {
                setShowModal(false);
                setEditingTask(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
