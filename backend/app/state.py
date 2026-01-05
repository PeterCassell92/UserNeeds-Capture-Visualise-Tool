"""Global application state management."""

from .config import DEMO_MODE_ONLY


class AppState:
    """Global application state."""

    def __init__(self):
        # If DEMO_MODE_ONLY is set, initialize with demo mode enabled
        self._demo_mode = DEMO_MODE_ONLY
        self._locked = DEMO_MODE_ONLY

    @property
    def demo_mode(self) -> bool:
        """Get current demo mode state."""
        return self._demo_mode

    @demo_mode.setter
    def demo_mode(self, value: bool):
        """Set demo mode state.

        Raises:
            ValueError: If attempting to change demo mode when locked
        """
        if self._locked and not value:
            raise ValueError(
                "Cannot disable demo mode when DEMO_MODE_ONLY is set. "
                "Demo mode is locked to enabled state."
            )
        self._demo_mode = value

    @property
    def locked(self) -> bool:
        """Check if demo mode is locked (cannot be disabled)."""
        return self._locked


# Global application state instance
app_state = AppState()
