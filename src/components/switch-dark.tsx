'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function SwitchDark() {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative h-9 w-9 rounded-full border border-border bg-background hover:bg-accent transition-colors overflow-hidden"
      aria-label="Toggle theme"
    >
      <Sun className="absolute inset-0 m-auto h-[1.2rem] w-[1.2rem] text-primary transition-all duration-500 ease-in-out  scale-100 rotate-0 dark:scale-0 dark:rotate-90" />
      <Moon className="absolute inset-0 m-auto h-[1.2rem] w-[1.2rem] text-primary transition-all duration-500 ease-in-out scale-0 -rotate-90 dark:scale-100 dark:rotate-0" />
    </button>
  );
}
