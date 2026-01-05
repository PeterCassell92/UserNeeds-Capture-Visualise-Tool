"""Database access layer for User Needs Management API."""

import json
import shutil
from pathlib import Path
from .models import DataStore
from .config import DATA_FILE, DEMO_DATA_FILE, EXAMPLE_DATA_FILE


def get_data_file_path(demo_mode: bool = False) -> Path:
    """Get the appropriate data file path based on mode.

    Args:
        demo_mode: If True, use demo mode data file

    Returns:
        Path to the data file to use
    """
    if demo_mode:
        # In demo mode, use data.demomode.json
        # If it doesn't exist, copy from data.example.json
        if not DEMO_DATA_FILE.exists() and EXAMPLE_DATA_FILE.exists():
            shutil.copy(EXAMPLE_DATA_FILE, DEMO_DATA_FILE)
        return DEMO_DATA_FILE
    else:
        return DATA_FILE


def initialize_data_file(file_path: Path):
    """Initialize a data file with empty structure if it doesn't exist.

    Args:
        file_path: Path to the data file to initialize
    """
    if not file_path.exists():
        # Create empty structure
        empty_data = {
            "userGroups": [],
            "entities": [],
            "workflowPhases": [],
            "userNeeds": []
        }
        with open(file_path, 'w') as f:
            json.dump(empty_data, f, indent=2)


def load_data(demo_mode: bool = False) -> DataStore:
    """Load data from the appropriate data file.

    Args:
        demo_mode: If True, load from demo mode data file

    Returns:
        DataStore containing all data
    """
    file_path = get_data_file_path(demo_mode)

    # Initialize if doesn't exist
    initialize_data_file(file_path)

    with open(file_path, 'r') as f:
        data = json.load(f)
    return DataStore(**data)


def save_data(data: DataStore, demo_mode: bool = False):
    """Save data to the appropriate data file.

    Args:
        data: DataStore to save
        demo_mode: If True, save to demo mode data file
    """
    file_path = get_data_file_path(demo_mode)
    with open(file_path, 'w') as f:
        json.dump(data.model_dump(), f, indent=2)
