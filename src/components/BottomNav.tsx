'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Layers, Home, User, PlusCircle, Users } from 'lucide-react';
import sound from '@/services/soundService';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'HOME', href: '/', icon: Home },
    { label: 'WARDROBE', href: '/wardrobe', icon: Layers },
    { label: 'SCAN', href: '/scan', icon: PlusCircle, isScan: true },
    { label: 'TWIN', href: '/twinning', icon: Users },
    { label: 'PROFILE', href: '/profile', icon: User }
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-[#181A31]/95 backdrop-blur-md border-t border-[rgba(242,236,221,0.1)] px-3 py-2 shrink-0">
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
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#E44C4E] to-[#CCA166] text-[#181A31] flex items-center justify-center shadow-[0_8px_20px_rgba(228,76,78,0.4)] group-hover:scale-105 transition-transform">
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
