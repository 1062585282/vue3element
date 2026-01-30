#!/bin/bash
# Start all Module Federation services

echo "Starting Module Federation services..."

# Kill any existing vite processes
pkill -f "vite" 2>/dev/null || true

# Start remote services in background
echo "Starting Module service on port 3001..."
npm run dev:module &
MODULE_PID=$!

sleep 2

echo "Starting Menu service on port 3002..."
npm run dev:menu &
MENU_PID=$!

sleep 2

echo "Starting Role service on port 3003..."
npm run dev:role &
ROLE_PID=$!

sleep 2

echo "Starting Unit service on port 3004..."
npm run dev:unit &
UNIT_PID=$!

sleep 2

echo "Starting Host service on port 3000..."
npm run dev:host

# When host is stopped, kill all services
trap "pkill -f 'vite'; exit" SIGINT SIGTERM
wait