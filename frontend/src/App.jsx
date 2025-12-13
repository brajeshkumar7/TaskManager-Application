import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store.js';
import { useSocketStore } from './store/socket.store.js';
import { NotificationProvider } from './components/Notification.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Tasks } from './pages/Tasks.jsx';
import { Notifications } from './pages/Notifications.jsx';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, token } = useAuthStore();
  const { connect, isConnected } = useSocketStore();

  useEffect(() => {
    if (isAuthenticated && token && !isConnected) {
      connect(token);
    }
  }, [isAuthenticated, token, isConnected, connect]);

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { isAuthenticated, token } = useAuthStore();
  const { socket, isConnected } = useSocketStore();

  useEffect(() => {
    // Listen for socket events and update SWR cache
    if (socket) {
      socket.on('task:created', () => {
        // SWR will auto-revalidate on focus/reconnect
        window.dispatchEvent(new Event('task-updated'));
      });

      socket.on('task:updated', () => {
        window.dispatchEvent(new Event('task-updated'));
      });

      socket.on('task:deleted', () => {
        window.dispatchEvent(new Event('task-updated'));
      });

      socket.on('user:profile-updated', () => {
        // When any user's profile is updated, refresh tasks to show updated names
        window.dispatchEvent(new Event('task-updated'));
      });
    }

    return () => {
      if (socket) {
        socket.off('task:created');
        socket.off('task:updated');
        socket.off('task:deleted');
        socket.off('user:profile-updated');
      }
    };
  }, [socket]);

  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <Tasks />
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
