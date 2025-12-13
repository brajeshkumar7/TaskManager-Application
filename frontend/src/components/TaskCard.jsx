import { format } from 'date-fns';
import { useAuthStore } from '../store/auth.store.js';

const priorityColors = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-orange-100 text-orange-800',
  Urgent: 'bg-red-100 text-red-800',
};

const statusColors = {
  'To Do': 'bg-gray-100 text-gray-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Review: 'bg-purple-100 text-purple-800',
  Completed: 'bg-green-100 text-green-800',
};

export const TaskCard = ({ task, onEdit, onDelete }) => {
  const { user } = useAuthStore();
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';
  const isCreator = user?._id === task.creatorId._id || user?.id === task.creatorId._id;

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow ${isOverdue ? 'border-l-4 border-red-500' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800 truncate flex-1">{task.title}</h3>
        {isCreator && (
          <div className="flex gap-2 ml-2">
            <button
              onClick={() => onEdit(task)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
          {task.status}
        </span>
      </div>

      <div className="text-sm text-gray-500 space-y-1">
        <div>
          <span className="font-medium">Due:</span>{' '}
          <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
            {format(new Date(task.dueDate), 'MMM dd, yyyy')}
          </span>
        </div>
        <div>
          <span className="font-medium">Created by:</span> {task.creatorId.name}
        </div>
        {task.assignedToId && (
          <div>
            <span className="font-medium">Assigned to:</span> {task.assignedToId.name}
          </div>
        )}
      </div>
    </div>
  );
};
