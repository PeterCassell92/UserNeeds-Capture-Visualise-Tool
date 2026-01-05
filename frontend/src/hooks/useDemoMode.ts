import { useState } from 'react';

const DEMO_MODE_KEY = 'demoMode';

export function useDemoMode(): [boolean, (value: boolean) => void] {
  // Initialize from localStorage
  const [demoMode, setDemoModeState] = useState<boolean>(() => {
    const stored = localStorage.getItem(DEMO_MODE_KEY);
    return stored === 'true';
  });

  // Update localStorage when demoMode changes
  const setDemoMode = (value: boolean) => {
    setDemoModeState(value);
    localStorage.setItem(DEMO_MODE_KEY, String(value));
  };

  return [demoMode, setDemoMode];
}
