"""Configuration and constants for User Needs Management API."""

from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


# Base directory - parent of the app directory
BASE_DIR = Path(__file__).parent.parent


class Settings(BaseSettings):
    """Application settings with environment variable support."""

    # Demo mode configuration
    demo_mode_only: bool = False
    demo_storage_dir: str = str(BASE_DIR / "demo-storage")

    # CORS origins
    cors_origins: List[str] = [
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Common React dev port
        "http://localhost:3011",  # Docker frontend port
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


# Global settings instance
settings = Settings()

# Data file paths (in Docker: /app/, in local dev: backend/)
DATA_FILE = BASE_DIR / "data.json"

# Demo data stored in separate volume mount (Docker) or temp directory (local)
DEMO_STORAGE_DIR = Path(settings.demo_storage_dir)
DEMO_STORAGE_DIR.mkdir(parents=True, exist_ok=True)
DEMO_DATA_FILE = DEMO_STORAGE_DIR / "data.demomode.json"

EXAMPLE_DATA_FILE = BASE_DIR / "data.example.json"
TEMPLATE_DATA_FILE = BASE_DIR / "data.template.json"

# Export for backwards compatibility
CORS_ORIGINS = settings.cors_origins
DEMO_MODE_ONLY = settings.demo_mode_only
