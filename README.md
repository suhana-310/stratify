# 🚀 Stratify - Advanced Project Management System

A modern, real-time project management system built with React, Node.js, and MongoDB. Features responsive design, real-time collaboration, and professional UI/UX optimized for all devices.

## 🌐 Live Application
- **Frontend**: https://stratify31-app.web.app
- **Backend API**: https://stratify-production-57f5.up.railway.app/api

## ✨ Key Features
- **Real-time Collaboration** - Socket.IO powered live updates
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Project Management** - Kanban boards, task tracking, team management
- **Secure Authentication** - JWT-based authentication system
- **Modern UI/UX** - Professional design with smooth animations
- **Cross-platform** - Works seamlessly across all devices and browsers

## 🏗️ Architecture
```
Firebase Hosting ↔ Railway Backend ↔ MongoDB Atlas
     ↓                    ↓                ↓
React + Vite        Node.js + Express   Database
Socket.IO Client    Socket.IO Server    User & Project Data
```

## 📁 Project Structure
```
stratify/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Responsive UI components
│   │   ├── contexts/      # React contexts (Auth, Realtime)
│   │   ├── hooks/         # Custom hooks (useResponsive)
│   │   ├── pages/         # Main application pages
│   │   ├── services/      # API and Socket.IO services
│   │   └── utils/         # Helper utilities
│   ├── public/
│   ├── firebase.json     # Firebase hosting config
│   └── package.json
├── backend/           # Node.js + Express backend
│   ├── routes/        # API routes
│   ├── models/        # MongoDB models
│   ├── middleware/    # Auth & validation
│   ├── utils/         # Helper functions
│   ├── config/        # Database configuration
│   └── server.js      # Main server file
└── README.md          # This file
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework with Vite
- **Tailwind CSS** - Utility-first styling
- **Socket.IO Client** - Real-time communication
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing

### Backend
- **Node.js + Express** - Server framework
- **MongoDB + Mongoose** - Database and ODM
- **Socket.IO** - Real-time WebSocket communication
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Deployment
- **Frontend**: Firebase Hosting
- **Backend**: Railway Platform
- **Database**: MongoDB Atlas

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (for database)
- Firebase account (for frontend hosting)
- Railway account (for backend deployment)

### Local Development

1. **Clone and Setup**
   ```bash
   git clone https://github.com/suhana-310/stratify.git
   cd stratify
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure environment variables
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Configure environment variables
   npm run dev
   ```

## 📝 Environment Configuration

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🎯 Core Features

### Real-time Collaboration
- Live project updates across all connected clients
- Real-time task management and status changes
- Team member activity tracking
- Socket.IO powered instant synchronization

### Project Management
- Kanban board with drag-and-drop functionality
- Task creation, editing, and assignment
- Team member management with role-based permissions
- Project progress tracking and analytics

### Security & Performance
- JWT-based authentication system
- Password hashing with bcryptjs
- Protected routes and API endpoints
- Cross-device session management
- Optimized for mobile and desktop performance

## 📊 Production Status
- ✅ **Deployed & Live** - Fully accessible at production URLs
- ✅ **Real-time Features** - Socket.IO connections active
- ✅ **Responsive Design** - Optimized for all screen sizes
- ✅ **Cross-browser Compatible** - Chrome, Firefox, Safari, Edge
- ✅ **Performance Optimized** - Fast loading and smooth animations

## 🔧 Development Commands

### Frontend
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend
```bash
cd backend
npm run dev      # Start with nodemon
npm start        # Start production server
npm run seed     # Seed database with sample data
```

## 📞 Support
For issues or questions, please refer to the application's built-in help system or contact the development team.

---

**Built with ❤️ using modern web technologies for seamless project management**
