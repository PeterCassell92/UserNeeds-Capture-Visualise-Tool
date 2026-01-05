"""User groups endpoints."""

from fastapi import APIRouter, HTTPException
from typing import List

from ..models import UserGroup
from ..database import load_data, save_data
from ..config import SUPER_GROUP_PREFIXES
from ..state import app_state

router = APIRouter(prefix="/api/user-groups", tags=["user-groups"])


@router.get("", response_model=List[UserGroup])
def get_user_groups():
    """Get all user groups.

    Returns:
        List of all user groups
    """
    data = load_data(app_state.demo_mode)
    return data.userGroups


@router.post("", response_model=UserGroup)
def create_user_group(user_group: UserGroup):
    """Create a new user group.

    Args:
        user_group: The user group to create

    Returns:
        The created user group

    Raises:
        HTTPException: If user group ID already exists
    """
    data = load_data(app_state.demo_mode)

    # Check if ID already exists
    if any(ug.id == user_group.id for ug in data.userGroups):
        raise HTTPException(status_code=400, detail="User group with this ID already exists")

    data.userGroups.append(user_group)
    save_data(data, app_state.demo_mode)
    return user_group


@router.get("/next-id/{user_group_id}")
def get_next_id(user_group_id: str):
    """Generate the next available ID for a user group.

    Args:
        user_group_id: The user group to generate an ID for

    Returns:
        Next available ID and prefix

    Raises:
        HTTPException: If user group not found or invalid super group
    """
    data = load_data(app_state.demo_mode)

    # Find the user group
    user_group = next((ug for ug in data.userGroups if ug.id == user_group_id), None)
    if not user_group:
        raise HTTPException(status_code=404, detail="User group not found")

    # Get the super group prefix
    super_group = user_group.superGroup
    if not super_group or super_group not in SUPER_GROUP_PREFIXES:
        raise HTTPException(status_code=400, detail="Invalid super group")

    prefix = SUPER_GROUP_PREFIXES[super_group]

    # Find all IDs with this prefix
    matching_ids = []
    for need in data.userNeeds:
        if need.id.startswith(f"{prefix}-"):
            try:
                # Extract the numeric part
                numeric_part = need.id.split("-")[1]
                matching_ids.append(int(numeric_part))
            except (IndexError, ValueError):
                # Skip IDs that don't match the pattern
                continue

    # Get the next number
    next_num = max(matching_ids) + 1 if matching_ids else 1

    # Format with leading zeros (3 digits)
    next_id = f"{prefix}-{next_num:03d}"

    return {"nextId": next_id, "prefix": prefix}
