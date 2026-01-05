"""Demo mode management endpoints."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..state import app_state

router = APIRouter(prefix="/api/demo-mode", tags=["demo-mode"])


class DemoModeResponse(BaseModel):
    """Demo mode state response."""
    enabled: bool
    locked: bool


class DemoModeRequest(BaseModel):
    """Demo mode state request."""
    enabled: bool


@router.get("", response_model=DemoModeResponse)
def get_demo_mode():
    """Get current demo mode state.

    Returns:
        Current demo mode state (enabled: true/false, locked: true/false)
    """
    return DemoModeResponse(
        enabled=app_state.demo_mode,
        locked=app_state.locked
    )


@router.post("", response_model=DemoModeResponse)
def set_demo_mode(request: DemoModeRequest):
    """Set demo mode state.

    Args:
        request: Demo mode state to set

    Returns:
        Updated demo mode state

    Raises:
        HTTPException: If demo mode is locked and cannot be changed
    """
    try:
        app_state.demo_mode = request.enabled
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))

    return DemoModeResponse(
        enabled=app_state.demo_mode,
        locked=app_state.locked
    )
