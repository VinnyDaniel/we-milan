'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, Home, User, PlusCircle, Users } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import sound from '@/services/soundService';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const navItems = [
    { label: 'HOME', href: '/', icon: Home },
    { label: 'WARDROBE', href: '/wardrobe', icon: Layers },
    { label: 'SCAN', href: '/scan', icon: PlusCircle, isScan: true },
    { label: 'TWIN', href: '/twinning', icon: Users },
    { label: 'PROFILE', href: '/profile', icon: User }
  ];

  return (
    <nav
      className={`fixed md:absolute bottom-0 left-0 right-0 z-50 w-full max-w-[430px] mx-auto px-3 pt-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] border-t backdrop-blur-xl transition-colors duration-300 pointer-events-auto shrink-0 select-none ${
        isLight
          ? 'bg-[#FAF7F2]/95 border-[rgba(24,26,49,0.08)] shadow-[0_-8px_24px_rgba(24,26,49,0.06)]'
          : 'bg-[#181A31]/95 border-[rgba(242,236,221,0.1)] shadow-[0_-8px_24px_rgba(0,0,0,0.4)]'
      }`}
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isScan) {
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (!isActive) sound.playTransition();
                }}
                className="group flex flex-col items-center -mt-5"
                title="Scan Clothing"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#E44C4E] to-[#CCA166] text-[#181A31] flex items-center justify-center shadow-[0_8px_20px_rgba(228,76,78,0.4)] group-hover:scale-105 active:scale-95 transition-transform">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="font-mono text-[9px] tracking-wider text-[#CCA166] font-semibold mt-1">
                  SCAN
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (!isActive) sound.playTransition();
              }}
              className={`flex flex-col items-center py-1 px-1.5 rounded-xl transition-all ${
                isActive
                  ? 'text-[#CCA166]'
                  : isLight
                  ? 'text-[#616584] hover:text-[#181A31]'
                  : 'text-[#9C9FBE] hover:text-[#F2ECDD]'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 stroke-[2.3]' : 'stroke-[1.8]'
                }`}
              />
              <span
                className={`font-mono text-[9px] tracking-wider mt-1 ${
                  isActive ? 'font-semibold text-[#CCA166]' : 'font-normal'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-[#E44C4E] mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

