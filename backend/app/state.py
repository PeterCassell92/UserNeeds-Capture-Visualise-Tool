"""Global application state management."""

class AppState:
    """Global application state."""

    def __init__(self):
        self._demo_mode = False

    @property
    def demo_mode(self) -> bool:
        """Get current demo mode state."""
        return self._demo_mode

    @demo_mode.setter
    def demo_mode(self, value: bool):
        """Set demo mode state."""
        self._demo_mode = value


# Global application state instance
app_state = AppState()
