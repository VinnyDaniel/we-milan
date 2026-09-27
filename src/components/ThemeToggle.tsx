'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'icon' | 'pill';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'icon',
  className = ''
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`px-3 py-1.5 rounded-full border flex items-center gap-2 transition-all active:scale-95 ${
          isDark
            ? 'bg-[#272A4B] border-[rgba(242,236,221,0.18)] text-[#CCA166] hover:text-[#F2ECDD]'
            : 'bg-[#FFFFFF] border-[rgba(24,26,49,0.15)] text-[#181A31] shadow-sm hover:border-[#CCA166]'
        } ${className}`}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          {isDark ? (
            <Sun className="w-4 h-4 text-[#CCA166] animate-[spin_8s_linear_infinite]" />
          ) : (
            <Moon className="w-4 h-4 text-[#181A31]" />
          )}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
          {isDark ? 'Notte (Dark)' : 'Giorno (Light)'}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all active:scale-90 relative overflow-hidden ${
        isDark
          ? 'bg-[#272A4B] border-[rgba(242,236,221,0.15)] text-[#CCA166] hover:text-[#F2ECDD] hover:border-[#CCA166]'
          : 'bg-[#FFFFFF] border-[rgba(24,26,49,0.14)] text-[#181A31] shadow-sm hover:border-[#CCA166]'
      } ${className}`}
      title={`Switch to ${isDark ? 'Light (Giorno)' : 'Dark (Notte)'} theme`}
      aria-label="Toggle light and dark theme"
    >
      <div className="relative w-4 h-4 flex items-center justify-center transition-transform duration-300">
        {isDark ? (
          <Sun className="w-4 h-4 text-[#CCA166] transition-all hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-[#181A31] transition-all hover:-rotate-12" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
