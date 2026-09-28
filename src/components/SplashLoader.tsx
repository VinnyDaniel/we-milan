'use client';

import React, { useEffect, useState } from 'react';
import MoltenMetal from '@/components/reactbits/MoltenMetal';
import FoldText from '@/components/reactbits/FoldText';
import { assetPath } from '@/utils/asset';
import { useTheme } from '@/context/ThemeContext';

interface SplashLoaderProps {
  onComplete: () => void;
  brandName?: string;
  tagline?: string;
}

export const SplashLoader: React.FC<SplashLoaderProps> = ({
  onComplete,
  brandName = 'WE MILAN',
  tagline = 'Your wardrobe. Reimagined.'
}) => {
  const [stage, setStage] = useState<'enter' | 'pulse' | 'exit'>('enter');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    // 0ms - 800ms: Logo pops up and scales in
    const pulseTimer = setTimeout(() => {
      setStage('pulse');
    }, 600);

    // 2400ms: Smooth fade out
    const exitTimer = setTimeout(() => {
      setStage('exit');
    }, 2400);

    // 2900ms: Transition to app
    const finishTimer = setTimeout(() => {
      onComplete();
    }, 2900);

    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-700 ${
        isLight ? 'bg-[#FAF7F2] text-[#181A31]' : 'bg-[#181A31] text-[#F2ECDD]'
      } ${
        stage === 'exit' ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Molten Metal Caustic Canvas from React Bits */}
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${isLight ? 'opacity-30' : 'opacity-60'}`}>
        <MoltenMetal
          color1={isLight ? '#FAF7F2' : '#181A31'}
          color2={isLight ? '#FDA4AF' : '#E44C4E'}
          color3={isLight ? '#E8D5B5' : '#CCA166'}
          speed={0.4}
          scale={3.5}
          detail={4}
          glow={isLight ? 1.2 : 1.8}
          coreSize={0.08}
          swirl={1.2}
          fold={-0.25}
          blackPoint={isLight ? 0.02 : 0.08}
          brightness={isLight ? 0.95 : 1.2}
          colorMode="molten"
          grain={true}
          grainIntensity={0.06}
          mouseInteraction={true}
          mouseStrength={0.3}
          opacity={isLight ? 0.4 : 0.85}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* WE MILAN Official Logo Badge with pop & glow */}
        <div
          className={`w-28 h-28 flex items-center justify-center transition-all duration-700 ease-out transform ${
            stage === 'enter'
              ? 'scale-75 opacity-0 translate-y-4'
              : 'scale-100 opacity-100 translate-y-0'
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath('/logo.png')}
            alt="We Milan Logo"
            className="w-full h-full object-contain drop-shadow-[0_16px_40px_rgba(228,76,78,0.45)]"
          />
        </div>

        {/* Brand Title with FoldText 3D Origami Animation from React Bits */}
        <div className="mt-6 flex flex-col items-center">
          <FoldText
            text={brandName}
            hinge="top"
            trigger="mount"
            duration={0.75}
            stagger={0.06}
            creaseShading={0.6}
            perspective={800}
            fontSize="2.1rem"
            fontWeight={600}
            color={isLight ? '#181A31' : '#F2ECDD'}
            className="font-serif tracking-tight drop-shadow-md"
          />

          {/* Subtitle Tagline styled exactly as introductory website */}
          <div className="mt-3">
            <span className={`tagline-cursive text-xl tracking-wide block ${
              isLight ? 'text-[#9E7329]' : 'text-[#E2C78C]'
            }`}>
              The world&apos;s your runway
            </span>
          </div>
        </div>

        {/* Minimal loading indicator bar */}
        <div className={`w-32 h-[2px] rounded-full mt-7 overflow-hidden ${
          isLight ? 'bg-black/10' : 'bg-[rgba(242,236,221,0.15)]'
        }`}>
          <div className="h-full bg-gradient-to-r from-[#CCA166] via-[#E44C4E] to-[#CCA166] animate-[marquee_1.8s_ease-in-out_infinite]" />
        </div>

        <span className={`mt-4 font-mono text-[10px] tracking-wider ${
          isLight ? 'text-[#6B7280]' : 'text-[#9C9FBE]/75'
        }`}>
          TAP TO ENTER
        </span>
      </div>
    </div>
  );
};

export default SplashLoader;
