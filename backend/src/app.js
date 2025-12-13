import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import userRoutes from './routes/user.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io available to routes via req.io
app.use((req, res, next) => {
  req.io = req.app.get('io');
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
