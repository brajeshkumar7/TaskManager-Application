import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { mutate } from 'swr';
import toast from 'react-hot-toast';
import { authAPI } from '../api/auth.api.js';
import { useAuthStore } from '../store/auth.store.js';
import { useSocketStore } from '../store/socket.store.js';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export const ProfileDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const { user, updateUser, logout } = useAuthStore();
  const { disconnect } = useSocketStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  useEffect(() => {
    if (isOpen && user) {
      reset({
        name: user.name || '',
      });
    }
  }, [isOpen, user, reset]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await authAPI.updateProfile(data);
      updateUser(response.user);

      // Invalidate all task-related SWR caches to refresh with updated user data
      mutate((key) => typeof key === 'string' && key.startsWith('/tasks'));

      // Dispatch event to trigger task refresh
      window.dispatchEvent(new Event('task-updated'));

      toast.success('Profile updated successfully');
      setIsOpen(false); // Close dropdown after successful update
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    disconnect();
    toast.success('Logged out successfully');
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-600 hover:text-gray-800 font-medium focus:outline-none"
      >
        Profile
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Profile</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                />
                <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
