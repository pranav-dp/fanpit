#!/bin/bash

# Copy the data file to the build directory
echo "Copying data file to build directory..."
node copy-data.js

# Start the mock API server in the background
echo "Starting mock API server..."
node mockApi.js &
API_PID=$!

# Wait a moment for the API server to start
sleep 2

# Start the Next.js app
echo "Starting Next.js app..."
npm run dev

# When the Next.js app is terminated, also kill the API server
kill $API_PID
