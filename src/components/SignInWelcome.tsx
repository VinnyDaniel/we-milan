'use client';

import React, { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { assetPath } from '@/utils/asset';
import sound from '@/services/soundService';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SignInWelcomeProps {
  name: string;
  aesthetic?: string;
  onEnter: () => void;
}

export default function SignInWelcome({ name, aesthetic, onEnter }: SignInWelcomeProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Auto-continue after 3s if user doesn't tap
  useEffect(() => {
    const t = setTimeout(() => {
      onEnter();
    }, 3200);
    return () => clearTimeout(t);
  }, [onEnter]);

  const displayName = name?.trim() || 'Milanista';
  const firstName = displayName.split(' ')[0];

  return (
    <div
      className={`relative flex flex-col items-center justify-center min-h-full px-8 text-center transition-colors ${
        isLight ? 'bg-[#FAF7F2] text-[#181A31]' : 'bg-[#181A31] text-[#F2ECDD]'
      }`}
    >
      {/* Animated entrance */}
      <div style={{ animation: 'wbFadeUp 0.6s ease both' }}>
        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assetPath('/logo.png')}
          alt="We Milan"
          className="w-20 h-20 object-contain mx-auto mb-5 drop-shadow-[0_8px_20px_rgba(228,76,78,0.35)]"
        />

        {/* Greeting */}
        <p className={`font-mono text-xs uppercase tracking-widest mb-2 ${isLight ? 'text-[#9E7329]' : 'text-[#CCA166]'}`}>
          Welcome back
        </p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight leading-tight">
          {firstName} ✦
        </h1>

        {/* Aesthetic badge */}
        {aesthetic && (
          <div
            className={`inline-flex items-center gap-1.5 mt-4 px-4 py-1.5 rounded-full text-xs font-semibold border ${
              isLight
                ? 'bg-[#F2E8D5] border-[#CCA166]/40 text-[#9E7329]'
                : 'bg-[#272A4B] border-[rgba(204,161,102,0.3)] text-[#CCA166]'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            {aesthetic}
          </div>
        )}

        {/* Subtitle */}
        <p className={`text-sm mt-5 ${isLight ? 'text-[#616584]' : 'text-[#9C9FBE]'}`}>
          Your wardrobe is waiting.
        </p>

        {/* CTA button */}
        <button
          onClick={() => { sound.playCuteClick(); onEnter(); }}
          className="mt-8 bg-[#E44C4E] hover:bg-[#C43C3E] text-white font-bold px-8 py-3.5 rounded-full flex items-center gap-2 mx-auto transition-all active:scale-95 shadow-lg"
        >
          <span>Open My Wardrobe</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* CSS animation */}
      <style jsx>{`
        @keyframes wbFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
