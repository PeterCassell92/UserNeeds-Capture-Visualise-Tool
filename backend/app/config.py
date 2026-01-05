"""Configuration and constants for User Needs Management API."""

import os
from pathlib import Path

# Base directory - parent of the app directory
BASE_DIR = Path(__file__).parent.parent

# Data file paths (in Docker: /app/, in local dev: backend/)
DATA_FILE = BASE_DIR / "data.json"

# Demo data stored in separate volume mount (Docker) or temp directory (local)
DEMO_STORAGE_DIR = Path(os.getenv("DEMO_STORAGE_DIR", BASE_DIR / "demo-storage"))
DEMO_STORAGE_DIR.mkdir(parents=True, exist_ok=True)
DEMO_DATA_FILE = DEMO_STORAGE_DIR / "data.demomode.json"

EXAMPLE_DATA_FILE = BASE_DIR / "data.example.json"
TEMPLATE_DATA_FILE = BASE_DIR / "data.template.json"

# CORS configuration
CORS_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Common React dev port
    "http://localhost:3011",  # Docker frontend port
]
