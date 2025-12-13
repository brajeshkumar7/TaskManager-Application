# Quick Start Guide

## Prerequisites
- Node.js v18+ installed
- MongoDB running (local or Atlas)

## Step 1: Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

Backend runs on: http://localhost:5000

## Step 2: Frontend Setup

```bash
cd frontend
npm install
```

Start frontend:
```bash
npm run dev
```

Frontend runs on: http://localhost:5173

## Step 3: Test the Application

1. Open http://localhost:5173
2. Register a new account
3. Create tasks
4. Assign tasks to users
5. Test real-time updates by opening multiple browser tabs

## Running Tests

```bash
cd backend
npm test
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- For MongoDB Atlas, use connection string format: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

### Socket.io Connection Issues
- Check CORS settings in backend
- Verify JWT token is being sent
- Check browser console for errors

### Frontend Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version: `node --version` (should be v18+)
