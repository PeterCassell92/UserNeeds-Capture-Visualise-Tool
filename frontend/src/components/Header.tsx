import { useState, useRef, useEffect } from 'react';
import './Header.css';

interface HeaderProps {
  demoMode: boolean;
  onDemoModeToggle: (enabled: boolean) => void;
}

export function Header({ demoMode, onDemoModeToggle }: HeaderProps) {
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

  const handleDemoToggle = () => {
    onDemoModeToggle(!demoMode);
    setMenuOpen(false);
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-title">User Needs Visualiser</h1>

        <div className="header-right">
          {demoMode && (
            <span className="demo-badge" title="You are currently in demo mode">
              Demo Mode
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
                  className="menu-item"
                  onClick={handleDemoToggle}
                >
                  <span className="menu-item-label">Demo Mode</span>
                  <span className={`toggle-switch ${demoMode ? 'active' : ''}`}>
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
