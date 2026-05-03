"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // On mount, check if 'dark' class is present on html
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white/50 text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-emerald-400 dark:hover:text-white"
        aria-label="Toggle theme"
      >
        <div className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white/50 text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-emerald-400 dark:hover:text-white"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
