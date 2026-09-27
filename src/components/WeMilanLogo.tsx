'use client';

import React from 'react';
import Link from 'next/link';

interface WeMilanLogoProps {
  variant?: 'header' | 'monogram' | 'hero';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  asLink?: boolean;
}

export const WeMilanLogo: React.FC<WeMilanLogoProps> = ({
  variant = 'header',
  size = 'md',
  showSubtitle = true,
  className = '',
  asLink = true
}) => {
  const badgeSize = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl'
  }[size];

  const textSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl'
  }[size];

  const content = (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official We Milan App Icon */}
      <div
        className={`${badgeSize} shrink-0 overflow-hidden border border-[rgba(242,236,221,0.22)] shadow-[0_4px_14px_rgba(0,0,0,0.35),0_0_12px_rgba(204,161,102,0.15)] relative`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="We Milan Logo"
          className="w-full h-full object-cover"
        />
      </div>

      {variant !== 'monogram' && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-serif font-semibold tracking-tight text-[#F2ECDD] ${textSize}`}>
              WE MILAN
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E44C4E] shadow-[0_0_6px_#E44C4E]" />
          </div>
          {showSubtitle && (
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#CCA166] mt-0.5 font-medium">
              THE WORLD&apos;S YOUR RUNWAY
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" className="inline-flex transition-transform hover:opacity-95 active:scale-98">
        {content}
      </Link>
    );
  }

  return content;
};

export default WeMilanLogo;
