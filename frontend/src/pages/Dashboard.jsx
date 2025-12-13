import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';
import { useMyAssignedTasks, useMyCreatedTasks, useOverdueTasks } from '../hooks/useTasks.js';
import { TaskCard } from '../components/TaskCard.jsx';
import { TaskCardSkeleton } from '../components/Loader.jsx';
import { NotificationBell } from '../components/NotificationBell.jsx';
import { ProfileDropdown } from '../components/ProfileDropdown.jsx';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('assigned');

  const { tasks: assignedTasks, isLoading: assignedLoading } = useMyAssignedTasks();
  const { tasks: createdTasks, isLoading: createdLoading } = useMyCreatedTasks();
  const { tasks: overdueTasks, isLoading: overdueLoading } = useOverdueTasks();

  const getActiveTasks = () => {
    switch (activeTab) {
      case 'assigned':
        return { tasks: assignedTasks, isLoading: assignedLoading };
      case 'created':
        return { tasks: createdTasks, isLoading: createdLoading };
      case 'overdue':
        return { tasks: overdueTasks, isLoading: overdueLoading };
      default:
        return { tasks: [], isLoading: false };
    }
  };

  const { tasks, isLoading } = getActiveTasks();

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
              <TaskCard key={task._id} task={task} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
