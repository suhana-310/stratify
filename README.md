# Stratify - Real-time Project Management System

A modern, full-stack project management system with real-time collaboration features, built with React, Node.js, MongoDB, and Socket.IO.

## 🚀 Features

### Authentication & Security
- ✅ **Real-time Authentication** - JWT-based auth with refresh tokens
- ✅ **User Registration & Login** - Complete signup/signin flow
- ✅ **Email Confirmation** - Welcome email sent upon successful registration
- ✅ **Password Reset** - Email-based password recovery
- ✅ **Role-based Access Control** - Admin, Manager, Member roles
- ✅ **Session Management** - Secure token handling
- ✅ **Route Protection** - Dashboard only accessible after authentication
- 🔄 **Social Login** - Google & GitHub OAuth (coming soon)

### Real-time Collaboration
- ✅ **Live Updates** - Real-time project and user updates
- ✅ **Online Status** - See who's online/offline
- ✅ **Typing Indicators** - Real-time typing status
- ✅ **Instant Notifications** - Toast notifications for all events
- ✅ **Project Invitations** - Real-time team invitations

### Project Management
- ✅ **Project Creation** - Create and manage projects
- ✅ **Team Management** - Add/remove team members
- ✅ **Role Permissions** - Granular permission system
- ✅ **Project Dashboard** - Overview and analytics
- ✅ **Activity Logging** - Track all project activities

### Modern UI/UX
- ✅ **3D Animations** - Three.js powered backgrounds
- ✅ **Smooth Scrolling** - GSAP animations
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Dark/Light Theme** - Theme switching
- ✅ **Loading States** - Skeleton screens and spinners

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Three.js** - 3D graphics
- **GSAP** - Advanced animations
- **Socket.IO Client** - Real-time communication
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.IO** - Real-time engine
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd stratify
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# - Set MongoDB URI
# - Set JWT secrets
# - Configure email settings (optional for development)

# Test email system (optional)
npm run test-email

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env if needed (API URL should match backend)

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔐 Default Login Credentials

After running the seed script, you can login with these accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | admin123 |
| Manager | sarah@company.com | password123 |
| Member | mike@company.com | password123 |
| Member | emily@company.com | password123 |
| Member | alex@company.com | password123 |

## 🚀 Quick Start

1. **Start MongoDB** (if running locally)
2. **Start Backend**: `cd backend && npm run dev`
3. **Start Frontend**: `cd frontend && npm run dev`
4. **Open Browser**: Navigate to `http://localhost:5173`
5. **Login**: Use any of the default credentials above

## 📁 Project Structure

```
stratify/
├── backend/                 # Node.js backend
│   ├── config/             # Database configuration
│   ├── middleware/         # Auth, validation, error handling
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── scripts/           # Database seeding
│   ├── utils/             # Helper functions
│   └── server.js          # Main server file
│
├── frontend/               # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API & Socket services
│   │   ├── stores/        # State management
│   │   └── utils/         # Helper functions
│   └── package.json
│
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/stratify
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password

### Users
- `GET /api/users` - Get all users (Admin/Manager)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/:id/role` - Update user role (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/team` - Add team member

## 🔄 Real-time Events

### Socket.IO Events
- `user_online` - User comes online
- `user_offline` - User goes offline
- `project_created` - New project created
- `project_updated` - Project updated
- `project_deleted` - Project deleted
- `team_member_added` - New team member added
- `user_typing` - User typing indicator

## 📧 Email System

The application includes a comprehensive email system for user notifications with development-friendly features:

### Development Mode (Default)
- **Email Preview Files**: All emails are saved as HTML files in `backend/emails/` directory
- **Browser Viewing**: Double-click any `.html` file to view the email in your browser
- **Real-time Testing**: See exactly how emails look without needing SMTP credentials
- **No Configuration Required**: Works out of the box for development

### Production Mode
Configure these environment variables in `backend/.env` for real email sending:

```env
# For Gmail (recommended)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password  # Use App Password, not regular password

# For other SMTP providers
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@provider.com
EMAIL_PASS=your-password
```

### Gmail Setup Instructions:
1. Enable 2-factor authentication on your Google account
2. Generate an App Password: Google Account → Security → App passwords
3. Use the App Password in `EMAIL_PASS` (not your regular password)

### Email Types Included:
- ✅ **Registration Confirmation**: Welcome email with account setup info
- ✅ **Password Reset**: Secure password reset links with expiration
- ✅ **Email Verification**: Account verification emails
- ✅ **Welcome Messages**: Beautiful onboarding emails

### Testing Emails:
```bash
# Test all email templates
cd backend
npm run test-email

# Check generated email files
ls emails/
# Open any .html file in your browser to preview
```

## 🧪 Testing

### Test Email System
```bash
cd backend
npm run test-email
```

### Test Authentication
```bash
cd backend
npm run test-auth
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 or similar process manager
3. Configure reverse proxy (Nginx)
4. Set up SSL certificate

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to static hosting (Vercel, Netlify)
3. Update API URLs for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Ensure MongoDB is running
3. Verify environment variables are set correctly
4. Check that all dependencies are installed
5. Make sure ports 5000 and 5173 are available

## 🔮 Roadmap

- [ ] Task Management System
- [ ] File Upload & Attachments
- [ ] Advanced Analytics Dashboard
- [ ] Mobile App (React Native)
- [ ] OAuth Integration (Google, GitHub)
- [ ] Two-Factor Authentication
- [ ] Email Notifications
- [ ] Advanced Permissions System
- [ ] API Rate Limiting
- [ ] Audit Logging

---

**Happy coding! 🚀**