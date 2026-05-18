import { useState, useEffect } from 'react';

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
  const [isDark, setIsDark] = useState<boolean>(readDark);

  useEffect(() => {
    // Sync across browser tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key !== 'theme') return;
      const next = e.newValue === 'dark';
      applyDark(next);
      setIsDark(next);
    };
    window.addEventListener('storage', onStorage);

    // Follow OS preference changes when user has no explicit preference saved
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onMedia = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('theme') != null) return;
      applyDark(e.matches);
      setIsDark(e.matches);
    };
    mq.addEventListener('change', onMedia);

    return () => {
      window.removeEventListener('storage', onStorage);
      mq.removeEventListener('change', onMedia);
    };
  }, []);

  const toggle = () => {
    setIsDark(prev => {
      const next = !prev;
      applyDark(next);
      return next;
    });
  };

  return { isDark, toggle };
}
