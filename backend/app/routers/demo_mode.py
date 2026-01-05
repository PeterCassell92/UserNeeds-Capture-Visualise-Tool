"""Demo mode management endpoints."""

from fastapi import APIRouter
from pydantic import BaseModel

from ..state import app_state

router = APIRouter(prefix="/api/demo-mode", tags=["demo-mode"])


class DemoModeResponse(BaseModel):
    """Demo mode state response."""
    enabled: bool


class DemoModeRequest(BaseModel):
    """Demo mode state request."""
    enabled: bool


@router.get("", response_model=DemoModeResponse)
def get_demo_mode():
    """Get current demo mode state.

    Returns:
        Current demo mode state (enabled: true/false)
    """
    return DemoModeResponse(enabled=app_state.demo_mode)


@router.post("", response_model=DemoModeResponse)
def set_demo_mode(request: DemoModeRequest):
    """Set demo mode state.

    Args:
        request: Demo mode state to set

    Returns:
        Updated demo mode state
    """
    app_state.demo_mode = request.enabled
    return DemoModeResponse(enabled=app_state.demo_mode)
