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
import taskRoutes from './routes/tasks.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateSocket } from './middleware/socketAuth.js';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);

// Socket.IO setup with flexible CORS for cross-device access
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin
      if (!origin) return callback(null, true);
      
      // Allow Vercel domains and localhost
      if (origin.includes('vercel.app') || 
          origin.includes('stratify-31.vercel.app') ||
          origin.includes('firebaseapp.com') ||
          origin.includes('web.app') ||
          origin.includes('stratify-2026') ||
          origin.includes('stratify31-app') ||
          origin === process.env.CLIENT_URL ||
          origin.includes('localhost')) {
        return callback(null, true);
      }
      
      // Allow the request
      callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true,
    allowEIO3: true
  },
  transports: ['websocket', 'polling']
});

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https:", "wss:", "ws:"],
    },
  },
}));

// More flexible CORS configuration for cross-device access
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow Vercel domains (including preview deployments)
    if (origin.includes('vercel.app') || 
        origin.includes('stratify-31.vercel.app') ||
        origin.includes('firebaseapp.com') ||
        origin.includes('web.app') ||
        origin.includes('stratify-2026') ||
        origin.includes('stratify31-app') ||
        origin === process.env.CLIENT_URL ||
        origin === 'http://localhost:5173' ||
        origin === 'http://localhost:5174') {
      return callback(null, true);
    }
    
    // For development, allow localhost on any port
    if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    // Allow the request
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization']
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

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Debug middleware for CORS issues
app.use((req, res, next) => {
  const origin = req.get('Origin');
  console.log(`📡 Request from origin: ${origin || 'no-origin'} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

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