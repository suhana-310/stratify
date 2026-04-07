# Stratify - Real-time Project Management Platform

A modern, real-time project management platform built with React, Node.js, and Socket.IO for seamless team collaboration.

## ✨ Features

### 🚀 Real-time Collaboration
- **Live Updates**: All changes sync instantly across all connected users
- **Socket.IO Integration**: Robust real-time communication with automatic reconnection
- **Cross-Component Sync**: Projects, tasks, and team updates reflect everywhere immediately

### 📊 Project Management
- **Project Creation & Management**: Create, update, and organize projects with timelines
- **Team Management**: Add/remove team members with role-based permissions
- **Project Links**: Manage project-related links and resources
- **Status Tracking**: Monitor project progress with live status updates

### 📋 Kanban Board
- **Drag & Drop**: Smooth task management with real-time position updates
- **Multiple Columns**: Todo, In Progress, Review, Done
- **Task Details**: Comprehensive task information with priorities, due dates, and assignments
- **Live Updates**: See task changes instantly without page refresh

### 👥 Team Collaboration
- **User Management**: Comprehensive user profiles and authentication
- **Role-based Access**: Owner, Manager, Developer, Designer, Viewer roles
- **Team Activities**: Live activity feed showing team actions
- **Real-time Notifications**: Instant updates for task assignments and project changes

### 📈 Dashboard Analytics
- **Live Statistics**: Real-time project and task metrics
- **Activity Overview**: Recent activities and project summaries
- **Team Insights**: Team member statistics and project distribution

## 🛠️ Technology Stack

### Frontend
- **React 18** with Hooks and Context API
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive styling
- **Framer Motion** for smooth animations
- **Socket.IO Client** for real-time communication
- **React Hot Toast** for user notifications

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time bidirectional communication
- **JWT Authentication** with secure token management
- **bcryptjs** for password hashing
- **Helmet** for security headers

### Real-time Features
- **Socket.IO** for instant data synchronization
- **Event-driven Architecture** for scalable real-time updates
- **Automatic Reconnection** with connection resilience
- **Room-based Broadcasting** for efficient data distribution

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stratify
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Copy environment file and configure
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   
   # Start the backend server
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Copy environment file and configure
   cp .env.example .env
   # Edit .env with your backend API URL
   
   # Start the frontend development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Environment Configuration

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stratify
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 📁 Project Structure

```
stratify/
├── backend/                 # Node.js backend application
│   ├── config/             # Database configuration
│   ├── middleware/         # Express middleware (auth, validation, etc.)
│   ├── models/            # MongoDB models (User, Project, Task)
│   ├── routes/            # API routes (auth, users, projects, tasks)
│   ├── utils/             # Utility functions
│   ├── server.js          # Main server file with Socket.IO setup
│   └── package.json       # Backend dependencies
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── dashboard/ # Dashboard and main app components
│   │   │   ├── sections/  # Landing page sections
│   │   │   └── ui/        # Reusable UI components
│   │   ├── contexts/      # React contexts (Auth, Realtime)
│   │   ├── services/      # API services and Socket.IO client
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # App entry point
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## 🔧 Key Features Implementation

### Real-time System
- **Socket.IO Integration**: Bidirectional real-time communication
- **Event Broadcasting**: Efficient room-based event distribution
- **Automatic Reconnection**: Handles network interruptions gracefully
- **State Synchronization**: Unified state management across all components

### Authentication System
- **JWT-based Authentication**: Secure token-based auth
- **Protected Routes**: Route-level access control
- **Role-based Permissions**: Granular permission system
- **Session Management**: Persistent login with refresh tokens

### Data Management
- **MongoDB Integration**: Flexible document-based storage
- **Mongoose ODM**: Structured data modeling with validation
- **Real-time Updates**: Database changes trigger Socket.IO events
- **Data Relationships**: Proper user, project, and task associations

## 🎯 Usage

### Creating Projects
1. Navigate to the Dashboard
2. Click "New Project" 
3. Fill in project details (name, description, timeline)
4. Add team members and assign roles
5. Project appears instantly for all team members

### Managing Tasks
1. Select a project to view the Kanban board
2. Click "Add Task" to create new tasks
3. Drag and drop tasks between columns
4. Assign tasks to team members
5. All changes sync in real-time

### Team Collaboration
1. Add team members to projects with specific roles
2. Assign tasks and track progress
3. View live activity feeds
4. Receive real-time notifications for updates

## 🔒 Security Features

- **JWT Authentication** with secure token storage
- **Password Hashing** using bcryptjs
- **Input Validation** and sanitization
- **CORS Configuration** for secure cross-origin requests
- **Helmet.js** for security headers
- **Rate Limiting** to prevent abuse

## 🚀 Production Deployment

### Backend Deployment
1. Set production environment variables
2. Configure MongoDB connection
3. Set up process manager (PM2)
4. Configure reverse proxy (Nginx)
5. Enable SSL/HTTPS

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, etc.)
3. Configure environment variables for production API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

- Built with modern web technologies for optimal performance
- Real-time features powered by Socket.IO
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion

---

**Status**: ✅ Production Ready  
**Real-time Features**: ✅ Fully Functional  
**Last Updated**: April 2026