'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import sound from '@/services/soundService';

interface SoundToggleProps {
  className?: string;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({ className = '' }) => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(sound.getMuted());
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sound.playClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`w-8 h-8 rounded-full bg-[#272A4B] border border-[rgba(242,236,221,0.14)] flex items-center justify-center transition-all hover:border-[#CCA166] active:scale-90 ${
        isMuted ? 'text-[#9C9FBE]' : 'text-[#CCA166]'
      } ${className}`}
      title={isMuted ? 'Enable sounds' : 'Mute sounds'}
      aria-label={isMuted ? 'Enable sounds' : 'Mute sounds'}
    >
      {isMuted ? (
        <VolumeX className="w-3.5 h-3.5" />
      ) : (
        <Volume2 className="w-3.5 h-3.5 stroke-[2.2]" />
      )}
    </button>
  );
};

export default SoundToggle;
