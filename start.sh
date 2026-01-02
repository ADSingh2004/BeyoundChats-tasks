#!/bin/bash

# BeyondChats Development Server Startup Script
# This script starts both the backend and frontend servers

echo "🚀 Starting BeyondChats Content Pipeline..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Install dependencies if needed
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "$SCRIPT_DIR/frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd "$SCRIPT_DIR/frontend"
    npm install
    cd "$SCRIPT_DIR"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All dependencies installed successfully!"
echo ""
echo "📌 Starting servers..."
echo "   Backend: http://localhost:5000"
echo "   Frontend: http://localhost:5173"
echo ""
echo "💡 Keep this terminal open. Both servers are running."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start backend in background
echo "🔧 Starting Backend Server..."
node "$SCRIPT_DIR/api/server.js" &
BACKEND_PID=$!
sleep 2

# Start frontend in another background process
echo "⚛️  Starting Frontend Dev Server..."
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✨ All servers started!"
echo ""
echo "🌐 Open your browser and go to: http://localhost:5173"
echo ""
echo "To stop the servers, press Ctrl+C or run:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Wait for both processes
wait
