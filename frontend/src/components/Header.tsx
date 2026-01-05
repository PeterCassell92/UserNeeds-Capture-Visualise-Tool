import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setDemoModeAsync } from '../store/settingsSlice';
import { loadReferenceData, loadUserNeeds } from '../store/userNeedsSlice';
import './Header.css';

export function Header() {
  const dispatch = useAppDispatch();
  const demoMode = useAppSelector((state) => state.settings.demoMode);
  const demoModeLocked = useAppSelector((state) => state.settings.demoModeLocked);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpen]);

  const handleDemoToggle = async () => {
    if (demoModeLocked) {
      // Don't allow toggle if locked
      return;
    }

    // Update demo mode on backend
    await dispatch(setDemoModeAsync(!demoMode));
    // Reload all data with new demo mode setting
    await dispatch(loadReferenceData());
    await dispatch(loadUserNeeds());
    setMenuOpen(false);
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-title">User Needs Visualiser</h1>

        <div className="header-right">
          {demoMode && (
            <span
              className="demo-badge"
              title={demoModeLocked ? "Demo mode is locked" : "You are currently in demo mode"}
            >
              Demo Mode{demoModeLocked && ' 🔒'}
            </span>
          )}

          <div className="menu-container" ref={menuRef}>
            <button
              className="menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="10" cy="4" r="1.5" />
                <circle cx="10" cy="10" r="1.5" />
                <circle cx="10" cy="16" r="1.5" />
              </svg>
            </button>

            {menuOpen && (
              <div className="dropdown-menu">
                <button
                  className={`menu-item ${demoModeLocked ? 'disabled' : ''}`}
                  onClick={handleDemoToggle}
                  disabled={demoModeLocked}
                  title={demoModeLocked ? "Demo mode is locked and cannot be changed" : "Toggle demo mode"}
                >
                  <span className="menu-item-label">Demo Mode</span>
                  <span className={`toggle-switch ${demoMode ? 'active' : ''} ${demoModeLocked ? 'locked' : ''}`}>
                    <span className="toggle-slider"></span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
