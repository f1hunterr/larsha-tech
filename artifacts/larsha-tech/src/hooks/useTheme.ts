import { useState } from 'react';

function readDark(): boolean {
  try {
    return document.documentElement.classList.contains('dark');
  } catch {
    return false;
  }
}

function applyDark(next: boolean) {
  if (next) {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }
  try {
    localStorage.setItem('theme', next ? 'dark' : 'light');
  } catch {}
}

export function useTheme() {
  // Initialize synchronously — avoids the useEffect delay and stale-closure bug
  const [isDark, setIsDark] = useState<boolean>(readDark);

  const toggle = () => {
    // Functional update ensures we always invert the real current value,
    // not a potentially stale closure copy
    setIsDark(prev => {
      const next = !prev;
      applyDark(next);
      return next;
    });
  };

  return { isDark, toggle };
}
