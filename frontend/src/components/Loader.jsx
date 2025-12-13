export const Loader = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};

export const SkeletonLoader = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
};

export const TaskCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-6 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
};
