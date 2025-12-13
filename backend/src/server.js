import http from 'http';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { initializeSocket } from './config/socket.js';
import app from './app.js';

const server = http.createServer(app);
const io = initializeSocket(server);

// Make io available to app
app.set('io', io);

const startServer = async () => {
  try {
    await connectDB();

    server.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📡 Socket.io initialized`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
