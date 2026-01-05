"""Setup and statistics endpoints."""

import json
from fastapi import APIRouter

from ..database import load_data
from ..config import DATA_FILE
from ..state import app_state

router = APIRouter(prefix="/api", tags=["setup"])


@router.get("/check-setup")
def check_setup():
    """Check if initial setup is required.

    Returns:
        hasData: Whether the data file exists
        needsSetup: Whether initial setup is needed (no user groups)
    """
    # Always check the main data.json file for setup status
    has_data = DATA_FILE.exists()
    needs_setup = False

    if has_data:
        try:
            with open(DATA_FILE, 'r') as f:
                data = json.load(f)
                # Check if there's at least one user group
                needs_setup = len(data.get('userGroups', [])) == 0
        except:
            needs_setup = True
    else:
        needs_setup = True

    return {
        "hasData": has_data,
        "needsSetup": needs_setup
    }


@router.get("/statistics")
def get_statistics():
    """Get statistics about user needs.

    Returns:
        Statistics grouped by user group, workflow phase, and entity
    """
    data = load_data(app_state.demo_mode)

    # Group by user group
    by_user_group = {}
    for need in data.userNeeds:
        if need.userGroupId not in by_user_group:
            by_user_group[need.userGroupId] = 0
        by_user_group[need.userGroupId] += 1

    # Group by workflow phase
    by_workflow_phase = {}
    for need in data.userNeeds:
        if need.workflowPhase not in by_workflow_phase:
            by_workflow_phase[need.workflowPhase] = 0
        by_workflow_phase[need.workflowPhase] += 1

    # Group by entity
    by_entity = {}
    for need in data.userNeeds:
        for entity in need.entities:
            if entity not in by_entity:
                by_entity[entity] = 0
            by_entity[entity] += 1

    return {
        "totalNeeds": len(data.userNeeds),
        "byUserGroup": by_user_group,
        "byWorkflowPhase": by_workflow_phase,
        "byEntity": by_entity
    }
