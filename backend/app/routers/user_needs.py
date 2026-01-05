"""User needs CRUD endpoints."""

from fastapi import APIRouter, HTTPException
from typing import List, Optional

from ..models import UserNeed, UserNeedCreate, UserNeedUpdate
from ..database import load_data, save_data
from ..state import app_state

router = APIRouter(prefix="/api/user-needs", tags=["user-needs"])


@router.get("", response_model=List[UserNeed])
def get_user_needs(
    userGroupId: Optional[str] = None,
    entity: Optional[str] = None,
    workflowPhase: Optional[str] = None,
    superGroup: Optional[str] = None,
    refined: Optional[str] = None
):
    """Get all user needs with optional filters.

    Args:
        userGroupId: Filter by user group ID
        entity: Filter by entity ID
        workflowPhase: Filter by workflow phase ID
        superGroup: Filter by super group
        refined: Filter by refinement status ('refined' or 'needsRefinement')

    Returns:
        List of user needs matching the filters
    """
    data = load_data(app_state.demo_mode)
    needs = data.userNeeds

    # Apply filters
    if userGroupId:
        needs = [n for n in needs if n.userGroupId == userGroupId]
    if entity:
        needs = [n for n in needs if entity in n.entities]
    if workflowPhase:
        needs = [n for n in needs if n.workflowPhase == workflowPhase]
    if superGroup:
        # Filter by superGroup - need to look up user groups
        user_group_ids_in_super_group = [ug.id for ug in data.userGroups if ug.superGroup == superGroup]
        needs = [n for n in needs if n.userGroupId in user_group_ids_in_super_group]
    if refined:
        if refined == 'refined':
            needs = [n for n in needs if n.refined == True]
        elif refined == 'needsRefinement':
            needs = [n for n in needs if n.refined != True]

    return needs


@router.get("/{need_id}", response_model=UserNeed)
def get_user_need(need_id: str):
    """Get a specific user need by ID.

    Args:
        need_id: The ID of the user need to retrieve

    Returns:
        The requested user need

    Raises:
        HTTPException: If user need not found
    """
    data = load_data(app_state.demo_mode)
    need = next((n for n in data.userNeeds if n.id == need_id), None)
    if not need:
        raise HTTPException(status_code=404, detail="User need not found")
    return need


@router.post("", response_model=UserNeed)
def create_user_need(need: UserNeedCreate):
    """Create a new user need.

    Args:
        need: The user need to create

    Returns:
        The created user need

    Raises:
        HTTPException: If ID already exists or invalid references
    """
    data = load_data(app_state.demo_mode)

    # Check if ID already exists
    if any(n.id == need.id for n in data.userNeeds):
        raise HTTPException(status_code=400, detail="User need with this ID already exists")

    # Validate references
    if not any(ug.id == need.userGroupId for ug in data.userGroups):
        raise HTTPException(status_code=400, detail="Invalid userGroupId")
    if not any(wp.id == need.workflowPhase for wp in data.workflowPhases):
        raise HTTPException(status_code=400, detail="Invalid workflowPhase")
    for entity_id in need.entities:
        if not any(e.id == entity_id for e in data.entities):
            raise HTTPException(status_code=400, detail=f"Invalid entity: {entity_id}")

    # Create new need
    new_need = UserNeed(**need.model_dump())
    data.userNeeds.append(new_need)
    save_data(data, app_state.demo_mode)
    return new_need


@router.put("/{need_id}", response_model=UserNeed)
def update_user_need(need_id: str, need_update: UserNeedUpdate):
    """Update an existing user need.

    Args:
        need_id: The ID of the user need to update
        need_update: The fields to update

    Returns:
        The updated user need

    Raises:
        HTTPException: If user need not found or invalid references
    """
    data = load_data(app_state.demo_mode)

    # Find the need
    need_index = next((i for i, n in enumerate(data.userNeeds) if n.id == need_id), None)
    if need_index is None:
        raise HTTPException(status_code=404, detail="User need not found")

    # Get existing need
    existing_need = data.userNeeds[need_index]

    # Validate references if provided
    if need_update.userGroupId and not any(ug.id == need_update.userGroupId for ug in data.userGroups):
        raise HTTPException(status_code=400, detail="Invalid userGroupId")
    if need_update.workflowPhase and not any(wp.id == need_update.workflowPhase for wp in data.workflowPhases):
        raise HTTPException(status_code=400, detail="Invalid workflowPhase")
    if need_update.entities:
        for entity_id in need_update.entities:
            if not any(e.id == entity_id for e in data.entities):
                raise HTTPException(status_code=400, detail=f"Invalid entity: {entity_id}")

    # Update fields
    update_dict = need_update.model_dump(exclude_unset=True)
    updated_need = existing_need.model_copy(update=update_dict)
    data.userNeeds[need_index] = updated_need
    save_data(data, app_state.demo_mode)
    return updated_need


@router.delete("/{need_id}")
def delete_user_need(need_id: str):
    """Delete a user need.

    Args:
        need_id: The ID of the user need to delete

    Returns:
        Success message with deleted ID

    Raises:
        HTTPException: If user need not found
    """
    data = load_data(app_state.demo_mode)

    # Find and remove the need
    need_index = next((i for i, n in enumerate(data.userNeeds) if n.id == need_id), None)
    if need_index is None:
        raise HTTPException(status_code=404, detail="User need not found")

    deleted_need = data.userNeeds.pop(need_index)
    save_data(data, app_state.demo_mode)
    return {"message": "User need deleted successfully", "id": deleted_need.id}
