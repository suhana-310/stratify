# 🚀 Stratify - Advanced Project Management System

## Overview
Stratify is a modern, real-time project management system built with React, Node.js, and MongoDB. It features advanced 3D animations, real-time collaboration, and a premium UI/UX design.

## 🌐 Live Application
- **Frontend**: https://stratify31-app.web.app
- **Backend API**: https://stratify-production-57f5.up.railway.app/api

## 🔑 Test Credentials
- **Email**: roshankumarsingh021@gmail.com
- **Password**: Password123

## ✨ Features
- **Real-time Collaboration**: Socket.IO powered live updates
- **Project Management**: Kanban boards, task tracking, team management
- **3D Animations**: Advanced GSAP and Three.js animations
- **Authentication**: JWT-based secure authentication
- **Cross-device Support**: Works on all devices and browsers
- **Modern UI/UX**: Premium design with smooth animations

## 🏗️ Architecture
```
Firebase Hosting ↔ Railway Backend ↔ MongoDB Atlas
     ↓                    ↓                ↓
React + Vite        Node.js + Express   Database
Socket.IO Client    Socket.IO Server    User & Project Data
```

## 🚀 Deployment Status
- ✅ **Frontend**: Firebase Hosting (stratify31-app.web.app)
- ✅ **Backend**: Railway (stratify-production-57f5.up.railway.app)
- ✅ **Database**: MongoDB Atlas (stratify-cluster.7jv5xvd.mongodb.net)
- ✅ **Real-time**: Socket.IO connections active
- ✅ **CORS**: Configured for cross-device access

## 📁 Project Structure
```
stratify/
├── frontend/          # React + Vite frontend
│   ├── src/
│   ├── public/
│   ├── firebase.json  # Firebase hosting config
│   └── package.json
├── backend/           # Node.js + Express backend
│   ├── routes/        # API routes
│   ├── models/        # MongoDB models
│   ├── middleware/    # Auth & validation
│   ├── utils/         # Helper functions
│   └── server.js      # Main server file
└── README.md

```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Three.js** - 3D graphics and animations
- **GSAP** - Advanced animations
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Deployment & Infrastructure
- **Firebase Hosting** - Frontend deployment
- **Railway** - Backend deployment
- **MongoDB Atlas** - Database hosting
- **GitHub** - Version control

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
npm install
npm start
```

### Firebase Deployment
```bash
cd frontend
npm run build
npx firebase-tools deploy --only hosting
```

### Railway Deployment
```bash
cd backend
npx @railway/cli up
```

## 📊 Performance Features
- **Global CDN**: Firebase's worldwide content delivery
- **Automatic SSL**: HTTPS enabled by default
- **Real-time Updates**: Instant synchronization across devices
- **Optimized Build**: Vite-powered fast builds
- **Responsive Design**: Works on all screen sizes

## 🔐 Security Features
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt encryption
- **CORS Protection**: Configured for specific origins
- **Rate Limiting**: API request throttling
- **Input Validation**: Server-side validation
- **Helmet.js**: Security headers

## 📱 Real-time Features
- **Live Project Updates**: Changes sync instantly
- **Team Collaboration**: Real-time member activity
- **Task Management**: Live Kanban board updates
- **Socket.IO Integration**: Persistent connections
- **Cross-device Sync**: Updates across all devices

---

**Stratify 2026 - Advanced Project Management System**  
**Built with ❤️ using modern web technologies**