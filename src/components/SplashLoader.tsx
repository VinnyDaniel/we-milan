'use client';

import React, { useEffect, useState } from 'react';
import MoltenMetal from '@/components/reactbits/MoltenMetal';
import FoldText from '@/components/reactbits/FoldText';

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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#181A31] text-[#F2ECDD] cursor-pointer transition-opacity duration-700 ${
        stage === 'exit' ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Molten Metal Caustic Canvas from React Bits */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
        <MoltenMetal
          color1="#181A31"
          color2="#E44C4E"
          color3="#CCA166"
          speed={0.4}
          scale={3.5}
          detail={4}
          glow={1.8}
          coreSize={0.08}
          swirl={1.2}
          fold={-0.25}
          blackPoint={0.08}
          brightness={1.2}
          colorMode="molten"
          grain={true}
          grainIntensity={0.06}
          mouseInteraction={true}
          mouseStrength={0.3}
          opacity={0.85}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* WE MILAN Official Logo Badge with pop & glow */}
        <div
          className={`w-28 h-28 rounded-3xl overflow-hidden border border-[rgba(242,236,221,0.25)] shadow-[0_20px_60px_rgba(228,76,78,0.4)] flex items-center justify-center transition-all duration-700 ease-out transform ${
            stage === 'enter'
              ? 'scale-75 opacity-0 translate-y-4'
              : 'scale-100 opacity-100 translate-y-0'
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="We Milan Logo"
            className="w-full h-full object-cover"
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
            color="#F2ECDD"
            className="font-serif tracking-tight drop-shadow-md"
          />

          {/* Subtitle / Tagline FoldText */}
          <div className="mt-2">
            <FoldText
              text={tagline}
              splitBy="word"
              hinge="left"
              trigger="mount"
              duration={0.65}
              stagger={0.08}
              creaseShading={0.4}
              fontSize="0.8rem"
              fontWeight={500}
              color="#CCA166"
              className="font-sans uppercase tracking-[0.2em]"
            />
          </div>
        </div>

        {/* Minimal loading indicator bar */}
        <div className="w-32 h-[2px] bg-[rgba(242,236,221,0.15)] rounded-full mt-7 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#CCA166] via-[#E44C4E] to-[#CCA166] animate-[marquee_1.8s_ease-in-out_infinite]" />
        </div>

        <span className="mt-4 font-mono text-[10px] text-[#9C9FBE]/75 tracking-wider">
          TAP TO ENTER
        </span>
      </div>
    </div>
  );
};

export default SplashLoader;
