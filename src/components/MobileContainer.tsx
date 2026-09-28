'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import sound from '@/services/soundService';

const GradientWaves = dynamic(() => import('@/components/reactbits/GradientWaves'), {
  ssr: false,
});

interface MobileContainerProps {
  children: React.ReactNode;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);

  // Transition swoosh sound when route changes
  useEffect(() => {
    if (prevPathRef.current && prevPathRef.current !== pathname) {
      sound.playTransition();
    }
    prevPathRef.current = pathname;
  }, [pathname]);

  // Subtle luxury tactile click sound for all interactive buttons, links, controls
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('[aria-label*="sounds"]')) return;

      const clickable = target.closest(
        'button, a, [role="button"], input[type="submit"], input[type="button"], input[type="radio"], input[type="checkbox"], select, summary'
      );
      if (clickable) {
        sound.playClick();
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true, passive: true });
    return () => {
      window.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, []);

  return (
    <div
      className={`h-screen h-[100dvh] w-full flex justify-center items-center py-0 md:py-6 selection:bg-[#E44C4E] selection:text-[#181A31] transition-colors duration-300 overflow-hidden ${
        isDark ? 'bg-[#101222] text-[#F2ECDD]' : 'bg-[#EDE8DC] text-[#181A31]'
      }`}
    >
      {/* Background ambient dynamic waves for desktop viewport */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0 hidden md:block">
        <GradientWaves
          horizonColor={isDark ? '#181A31' : '#E5DFD0'}
          waveColor={isDark ? '#272A4B' : '#FAF7F2'}
          crestColor="#CCA166"
          speed={0.2}
          amplitude={2.0}
          waveScale={0.5}
          opacity={isDark ? 0.5 : 0.35}
          detail="medium"
          grain={true}
          grainIntensity={0.03}
        />
      </div>

      {/* Main 430px Mobile Application Shell */}
      <div
        className={`relative w-full md:max-w-[430px] h-screen h-[100dvh] md:h-[92vh] md:max-h-[920px] flex flex-col md:rounded-[36px] overflow-hidden md:border transition-all duration-300 z-10 ${
          isDark
            ? 'bg-[#181A31] text-[#F2ECDD] md:border-[rgba(242,236,221,0.12)] md:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)_inset]'
            : 'bg-[#FAF7F2] text-[#181A31] md:border-[rgba(24,26,49,0.12)] md:shadow-[0_25px_70px_-15px_rgba(39,42,75,0.22),0_0_0_1px_rgba(255,255,255,0.8)_inset]'
        }`}
      >
        {/* Subtle iOS home bar / speaker indicator on desktop shell */}
        <div
          className={`hidden md:flex justify-center items-center pt-2.5 pb-1 shrink-0 z-20 ${
            isDark ? 'bg-[#181A31]' : 'bg-[#FAF7F2]'
          }`}
        >
          <div
            className={`w-24 h-1 rounded-full ${
              isDark ? 'bg-[rgba(242,236,221,0.2)]' : 'bg-[rgba(24,26,49,0.18)]'
            }`}
          />
        </div>

        {/* Ambient Wave Canvas inside the mobile frame behind all views */}
        <div
          className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${
            isDark ? 'opacity-30' : 'opacity-25'
          }`}
        >
          <GradientWaves
            horizonColor={isDark ? '#181A31' : '#FAF7F2'}
            waveColor={isDark ? '#272A4B' : '#F1EBE0'}
            crestColor="#CCA166"
            speed={0.25}
            amplitude={1.8}
            waveScale={0.7}
            opacity={isDark ? 0.45 : 0.3}
            detail="low"
            grain={true}
            grainIntensity={0.03}
          />
        </div>

        {/* Application content container */}
        <div className="flex-1 min-h-0 overflow-hidden relative flex flex-col z-10">
          {children}
        </div>
      </div>
    </div>
  );
};
