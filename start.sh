#!/bin/bash

# Stratify Development Startup Script

echo "🚀 Starting Stratify Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if MongoDB is running (optional check)
if command -v mongod &> /dev/null; then
    if ! pgrep -x "mongod" > /dev/null; then
        echo "⚠️  MongoDB doesn't seem to be running. Make sure MongoDB is started."
        echo "   You can start it with: mongod --dbpath /path/to/your/db"
    fi
fi

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use. Please free it or change the port."
        return 1
    fi
    return 0
}

# Check if required ports are available
check_port 5000 || exit 1
check_port 5173 || exit 1

echo "📦 Installing dependencies..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
fi

cd ..

echo "🗄️  Setting up database..."

# Check if .env exists in backend
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env with your MongoDB URI and other settings."
fi

# Check if .env exists in frontend
if [ ! -f "frontend/.env" ]; then
    echo "📝 Creating frontend .env file..."
    cp frontend/.env.example frontend/.env
fi

# Test email system (optional)
echo "📧 Testing email system..."
cd backend
npm run test-email
cd ..

# Seed database
echo "🌱 Seeding database with sample data..."
cd backend
npm run seed
cd ..

echo "🚀 Starting servers..."

# Start backend in background
echo "🔧 Starting backend server on port 5000..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server on port 5173..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Stratify is now running!"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:5000"
echo "📊 API:      http://localhost:5000/api"
echo ""
echo "🔐 Default Login Credentials:"
echo "   Admin:   admin@company.com / admin123"
echo "   Manager: sarah@company.com / password123"
echo "   Member:  mike@company.com / password123"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped. Goodbye!"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait