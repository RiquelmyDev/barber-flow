'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button className="rounded-xl border border-slate-200 p-2 text-slate-500">
        <SunIcon className="h-5 w-5" />
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:text-primary"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
}
