"""Metadata endpoints for entities and workflow phases."""

from fastapi import APIRouter
from typing import List

from ..models import Entity, WorkflowPhase
from ..database import load_data
from ..state import app_state

router = APIRouter(prefix="/api", tags=["metadata"])


@router.get("/entities", response_model=List[Entity])
def get_entities():
    """Get all entities.

    Returns:
        List of all entities
    """
    data = load_data(app_state.demo_mode)
    return data.entities


@router.get("/workflow-phases", response_model=List[WorkflowPhase])
def get_workflow_phases():
    """Get all workflow phases.

    Returns:
        List of all workflow phases
    """
    data = load_data(app_state.demo_mode)
    return data.workflowPhases
