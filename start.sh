#!/bin/bash

# BeyondChats Development Server Startup Script

echo "🚀 Starting BeyondChats Content Pipeline..."
echo ""

# --- FIX 1: AUTO-UPGRADE NODE.JS TO VERSION 20+ ---
# Vite requires Node 20+, but Codespaces often default to 18.
# This block checks the version and upgrades using nvm if needed.
CURRENT_NODE_VER=$(node -v | cut -d'.' -f1 | sed 's/v//')

if [ "$CURRENT_NODE_VER" -lt 20 ]; then
    echo "⚠️  Current Node.js version is $CURRENT_NODE_VER. Vite requires 20+."
    echo "🔄 Attempting to upgrade to Node.js 20..."
    
    # Load NVM (Node Version Manager)
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

    if command -v nvm &> /dev/null; then
        nvm install 20
        nvm use 20
        echo "✅ Switched to Node.js $(node -v)"
    else
        echo "❌ 'nvm' not found. Please manually upgrade Node.js to version 20+."
        exit 1
    fi
fi
# --------------------------------------------------

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

# --- FIX 2: FORCE PORT 5000 VISIBILITY TO PUBLIC ---
if [ -n "$CODESPACE_NAME" ] && command -v gh &> /dev/null; then
    echo "🔓 Detected Codespace: $CODESPACE_NAME"
    echo "🔓 Forcing Port 5000 to Public..."
    gh codespace ports visibility 5000:public -c "$CODESPACE_NAME"
else
    echo "⚠️  Skipping auto-port configuration (Not in Codespace or 'gh' missing)"
fi
# --------------------------------------------------

echo "📌 Starting servers..."
echo "   Backend: http://localhost:5000"
echo "   Frontend: http://localhost:5173"
echo ""

# Start backend
echo "🔧 Starting Backend Server..."
node "$SCRIPT_DIR/api/server.js" &
BACKEND_PID=$!
sleep 2

# Start frontend
echo "⚛️  Starting Frontend Dev Server..."
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✨ All servers started!"
echo ""
echo "To stop the servers, press Ctrl+C"

# Wait for both processes
wait