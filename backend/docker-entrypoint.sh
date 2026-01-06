#!/bin/bash
set -e

# Create data.json if it doesn't exist
if [ ! -f /app/data.json ]; then
    echo "Creating empty data.json from template..."
    cp /app/data.template.json /app/data.json
fi

# Create demo mode data file if it doesn't exist
if [ ! -f /app/demo-storage/data.demomode.json ]; then
    echo "Creating demo mode data from example..."
    mkdir -p /app/demo-storage
    cp /app/data.example.json /app/demo-storage/data.demomode.json
fi

# Start the application
exec "$@"
