#!/bin/bash
# Quick Start Script

echo "🚀 Starting High-Load Backend Setup..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
cd backend
npm install

# Step 2: Verify Docker services
echo "🐳 Checking Docker services..."
docker compose ps

# Step 3: Start backend
echo "✨ Starting backend server..."
npm start
