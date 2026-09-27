'use client';

import React from 'react';
import MoltenMetal from '@/components/reactbits/MoltenMetal';
import FoldText from '@/components/reactbits/FoldText';

interface OutfitDissolveOverlayProps {
  isActive: boolean;
  message?: string;
}

export const OutfitDissolveOverlay: React.FC<OutfitDissolveOverlayProps> = ({
  isActive,
  message = "Dissolving look..."
}) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-40 rounded-3xl overflow-hidden bg-[#181A31]/90 backdrop-blur-md flex flex-col items-center justify-center animate-fadeIn">
      {/* Molten Metal Liquid Canvas */}
      <div className="absolute inset-0 pointer-events-none opacity-85">
        <MoltenMetal
          color1="#272A4B"
          color2="#E44C4E"
          color3="#CCA166"
          speed={0.65}
          scale={5.0}
          detail={4}
          glow={2.2}
          coreSize={0.12}
          swirl={1.8}
          fold={-0.35}
          blackPoint={0.04}
          brightness={1.4}
          colorMode="ember"
          grain={true}
          grainIntensity={0.08}
          mouseInteraction={false}
          opacity={0.9}
        />
      </div>

      {/* Floating Status & Text */}
      <div className="relative z-10 text-center px-4">
        <div className="w-12 h-12 rounded-full bg-[#181A31]/80 border border-[#E44C4E] mx-auto mb-3 flex items-center justify-center shadow-lg animate-pulse">
          <div className="w-4 h-4 rounded-full bg-[#E44C4E]" />
        </div>

        <FoldText
          text={message}
          splitBy="char"
          hinge="bottom"
          trigger="mount"
          duration={0.5}
          stagger={0.03}
          perspective={600}
          fontSize="1.1rem"
          fontWeight={600}
          color="#F2ECDD"
          className="font-serif tracking-tight drop-shadow-lg"
        />

        <p className="font-mono text-[10px] text-[#CCA166] uppercase tracking-widest mt-1.5 drop-shadow">
          AI Remixing Silhouette
        </p>
      </div>
    </div>
  );
};

export default OutfitDissolveOverlay;
