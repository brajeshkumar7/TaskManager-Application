import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from './env.js';
import { User } from '../models/User.js';

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.substring(7);

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.name} (${socket.userId})`);

    // Join user's personal room for notifications
    socket.join(socket.userId);

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user.name} (${socket.userId})`);
    });
  });

  return io;
};
