import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import projectRoutes from './routes/projects.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateSocket } from './middleware/socketAuth.js';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);

// Socket.IO setup with authentication
const io = new Server(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Socket.IO authentication and real-time features
io.use(authenticateSocket);

io.on('connection', (socket) => {
  console.log(`User ${socket.user.name} connected (${socket.user.id})`);
  
  // Join user to their personal room
  socket.join(`user_${socket.user.id}`);
  
  // Join user to their project rooms
  socket.user.projects?.forEach(projectId => {
    socket.join(`project_${projectId}`);
  });

  // Handle real-time events
  socket.on('join_project', (projectId) => {
    socket.join(`project_${projectId}`);
    socket.to(`project_${projectId}`).emit('user_joined_project', {
      user: socket.user,
      projectId
    });
  });

  socket.on('leave_project', (projectId) => {
    socket.leave(`project_${projectId}`);
    socket.to(`project_${projectId}`).emit('user_left_project', {
      user: socket.user,
      projectId
    });
  });

  socket.on('typing_start', ({ projectId, taskId }) => {
    socket.to(`project_${projectId}`).emit('user_typing', {
      user: socket.user,
      projectId,
      taskId,
      typing: true
    });
  });

  socket.on('typing_stop', ({ projectId, taskId }) => {
    socket.to(`project_${projectId}`).emit('user_typing', {
      user: socket.user,
      projectId,
      taskId,
      typing: false
    });
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.user.name} disconnected`);
    // Broadcast user offline status to their projects
    socket.user.projects?.forEach(projectId => {
      socket.to(`project_${projectId}`).emit('user_offline', {
        userId: socket.user.id,
        timestamp: new Date()
      });
    });
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Socket.IO server ready for real-time connections`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

export default app;