#!/bin/bash
# Initialize data files for Docker Compose
# This script ensures data.json exists before Docker tries to mount it

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Initializing data files for User Needs Visualiser..."

# Create data.json if it doesn't exist
if [ ! -f "$PROJECT_ROOT/data.json" ]; then
    echo "  → Creating data.json from template..."
    cp "$PROJECT_ROOT/data.template.json" "$PROJECT_ROOT/data.json"
else
    echo "  ✓ data.json already exists"
fi

# Create data.demomode.json if it doesn't exist
if [ ! -f "$PROJECT_ROOT/data.demomode.json" ]; then
    echo "  → Creating data.demomode.json from example..."
    cp "$PROJECT_ROOT/data.example.json" "$PROJECT_ROOT/data.demomode.json"
else
    echo "  ✓ data.demomode.json already exists"
fi

echo "✓ Data files initialized successfully"
echo ""
echo "You can now run: docker-compose up -d"
