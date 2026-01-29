#!/bin/bash
# Copy CSV files from backend/ to frontend/public/backend/ for development
mkdir -p frontend/public/backend
cp backend/*.csv frontend/public/backend/
echo "✅ CSV files copied to frontend/public/backend/"
