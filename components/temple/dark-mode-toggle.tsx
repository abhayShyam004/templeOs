"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggle = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      className="fixed bottom-12 right-12 z-[200] w-14 h-14 bg-[var(--c-surface)] border hairline border-[var(--c-border-strong)] flex items-center justify-center shadow-2xl transition-all duration-300 group hover:-translate-y-1 active:translate-y-0"
      onClick={toggle}
      title="Toggle Interface Mode"
    >
      <div className="absolute inset-0 bg-[var(--c-accent)] scale-0 group-hover:scale-100 transition-transform duration-500 ease-[var(--ease-out-expo)]" />
      <div className="relative z-10 transition-colors duration-300 group-hover:text-[var(--c-text-inv)]">
        {isDark ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
      </div>
      
      {/* Corner Label */}
      <span className="absolute -top-6 right-0 label-mono text-[9px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {isDark ? 'Luminous' : 'Obscurity'} Mode
      </span>
    </button>
  );
}
