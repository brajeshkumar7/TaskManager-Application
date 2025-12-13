# Create .env Files

Since `.env` files are in `.gitignore`, you need to create them manually. Here's how:

## Option 1: Manual Creation (Recommended)

### Backend `.env` file
Create `backend/.env` with the following content:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env` file
Create `frontend/.env` with the following content:

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Option 2: Using PowerShell

Run these commands in PowerShell from the project root:

```powershell
# Backend .env
@"
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
"@ | Out-File -FilePath "backend\.env" -Encoding utf8

# Frontend .env
@"
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
"@ | Out-File -FilePath "frontend\.env" -Encoding utf8
```

## Important Notes

1. **Change JWT_SECRET**: For production, use a strong, random secret key
2. **MongoDB URI**: Update if using MongoDB Atlas or a different MongoDB instance
3. **Ports**: Adjust if ports 5000 or 5173 are already in use
