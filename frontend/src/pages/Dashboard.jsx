import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/auth.store.js';
import { useMyAssignedTasks, useMyCreatedTasks, useOverdueTasks } from '../hooks/useTasks.js';
import { taskAPI } from '../api/task.api.js';
import { TaskCard } from '../components/TaskCard.jsx';
import { TaskCardSkeleton } from '../components/Loader.jsx';
import { TaskForm } from '../components/TaskForm.jsx';
import { NotificationBell } from '../components/NotificationBell.jsx';
import { ProfileDropdown } from '../components/ProfileDropdown.jsx';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('assigned');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { tasks: assignedTasks, isLoading: assignedLoading, mutate: mutateAssigned } = useMyAssignedTasks();
  const { tasks: createdTasks, isLoading: createdLoading, mutate: mutateCreated } = useMyCreatedTasks();
  const { tasks: overdueTasks, isLoading: overdueLoading, mutate: mutateOverdue } = useOverdueTasks();

  const getActiveTasks = () => {
    switch (activeTab) {
      case 'assigned':
        return { tasks: assignedTasks, isLoading: assignedLoading, mutate: mutateAssigned };
      case 'created':
        return { tasks: createdTasks, isLoading: createdLoading, mutate: mutateCreated };
      case 'overdue':
        return { tasks: overdueTasks, isLoading: overdueLoading, mutate: mutateOverdue };
      default:
        return { tasks: [], isLoading: false, mutate: () => {} };
    }
  };

  const { tasks, isLoading, mutate } = getActiveTasks();

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
      // Refresh all tabs to keep counts accurate
      mutateAssigned();
      mutateCreated();
      mutateOverdue();
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
      // Refresh all tabs to keep counts accurate
      mutateAssigned();
      mutateCreated();
      mutateOverdue();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save task');
    }
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-600">Assigned to Me</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">{assignedTasks.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-600">Created by Me</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">{createdTasks.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-600">Overdue</h3>
              <p className="text-2xl font-bold text-red-600 mt-2">{overdueTasks.length}</p>
            </div>
          </div>

          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveTab('assigned')}
              className={`px-4 py-2 font-medium ${activeTab === 'assigned'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Assigned to Me
            </button>
            <button
              onClick={() => setActiveTab('created')}
              className={`px-4 py-2 font-medium ${activeTab === 'created'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Created by Me
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              className={`px-4 py-2 font-medium ${activeTab === 'overdue'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Overdue Tasks
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              <TaskCardSkeleton />
              <TaskCardSkeleton />
              <TaskCardSkeleton />
            </>
          ) : tasks.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No tasks found
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard 
                key={task._id} 
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </div>
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
