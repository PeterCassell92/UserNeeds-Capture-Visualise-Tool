"""User super groups endpoints."""

from fastapi import APIRouter, HTTPException
from typing import List

from ..models import UserSuperGroup
from ..database import load_data, save_data
from ..state import app_state

router = APIRouter(prefix="/api/user-super-groups", tags=["user-super-groups"])


@router.get("", response_model=List[UserSuperGroup])
def get_user_super_groups():
    """Get all user super groups.

    Returns:
        List of all user super groups
    """
    data = load_data(app_state.demo_mode)
    return data.userSuperGroups


@router.post("", response_model=UserSuperGroup)
def create_user_super_group(super_group: UserSuperGroup):
    """Create a new user super group.

    Args:
        super_group: The user super group to create

    Returns:
        The created user super group

    Raises:
        HTTPException: If super group ID or prefix already exists
    """
    data = load_data(app_state.demo_mode)

    # Check if ID already exists
    if any(sg.id == super_group.id for sg in data.userSuperGroups):
        raise HTTPException(status_code=400, detail="User super group with this ID already exists")

    # Check if prefix already exists
    if any(sg.prefix == super_group.prefix for sg in data.userSuperGroups):
        raise HTTPException(status_code=400, detail="User super group with this prefix already exists")

    data.userSuperGroups.append(super_group)
    save_data(data, app_state.demo_mode)
    return super_group


@router.put("/{super_group_id}", response_model=UserSuperGroup)
def update_user_super_group(super_group_id: str, super_group_update: UserSuperGroup):
    """Update an existing user super group.

    Args:
        super_group_id: The ID of the super group to update
        super_group_update: The updated super group data

    Returns:
        The updated super group

    Raises:
        HTTPException: If super group not found or conflicts exist
    """
    data = load_data(app_state.demo_mode)

    # Find the super group
    super_group_index = next((i for i, sg in enumerate(data.userSuperGroups) if sg.id == super_group_id), None)
    if super_group_index is None:
        raise HTTPException(status_code=404, detail="User super group not found")

    # Check for ID conflicts (if changing ID)
    if super_group_update.id != super_group_id:
        if any(sg.id == super_group_update.id for sg in data.userSuperGroups):
            raise HTTPException(status_code=400, detail="User super group with this ID already exists")

    # Check for prefix conflicts
    existing = data.userSuperGroups[super_group_index]
    if super_group_update.prefix != existing.prefix:
        if any(sg.prefix == super_group_update.prefix for sg in data.userSuperGroups):
            raise HTTPException(status_code=400, detail="User super group with this prefix already exists")

    data.userSuperGroups[super_group_index] = super_group_update
    save_data(data, app_state.demo_mode)
    return super_group_update


@router.delete("/{super_group_id}")
def delete_user_super_group(super_group_id: str):
    """Delete a user super group.

    Args:
        super_group_id: The ID of the super group to delete

    Returns:
        Success message with deleted ID

    Raises:
        HTTPException: If super group not found or has dependent user groups
    """
    data = load_data(app_state.demo_mode)

    # Check if any user groups reference this super group
    dependent_groups = [ug for ug in data.userGroups if ug.superGroup == super_group_id]
    if dependent_groups:
        group_names = ", ".join([ug.name for ug in dependent_groups])
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete super group: {len(dependent_groups)} user group(s) depend on it ({group_names})"
        )

    # Find and remove the super group
    super_group_index = next((i for i, sg in enumerate(data.userSuperGroups) if sg.id == super_group_id), None)
    if super_group_index is None:
        raise HTTPException(status_code=404, detail="User super group not found")

    deleted_super_group = data.userSuperGroups.pop(super_group_index)
    save_data(data, app_state.demo_mode)
    return {"message": "User super group deleted successfully", "id": deleted_super_group.id}
