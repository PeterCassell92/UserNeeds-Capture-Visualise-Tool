"""Configuration and constants for User Needs Management API."""

import os
from pathlib import Path

# Base directory - parent of the app directory
BASE_DIR = Path(__file__).parent.parent

# Data directory - use /app/data in Docker, otherwise parent of BASE_DIR
DATA_DIR = Path(os.getenv("DATA_DIR", BASE_DIR / "data"))
# Fallback to BASE_DIR if data directory doesn't exist (local development)
if not DATA_DIR.exists():
    DATA_DIR = BASE_DIR.parent

# Data file paths
DATA_FILE = DATA_DIR / "data.json"
DEMO_DATA_FILE = DATA_DIR / "data.demomode.json"
EXAMPLE_DATA_FILE = DATA_DIR / "data.example.json"
TEMPLATE_DATA_FILE = DATA_DIR / "data.template.json"

# Super group ID prefix mapping
SUPER_GROUP_PREFIXES = {
    "aykua": "AYK",
    "clinic": "CLI",
    "medical_services_user": "PAT"
}

# CORS configuration
CORS_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Common React dev port
    "http://localhost:3011",  # Docker frontend port
]
