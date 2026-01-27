#!/bin/bash
# Copy CSV files from backend/ to public/backend/ for development
mkdir -p public/backend
cp backend/*.csv public/backend/
echo "✅ CSV files copied to public/backend/"
