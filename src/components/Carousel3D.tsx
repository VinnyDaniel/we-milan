'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { WardrobeItem } from '@/types/wardrobe';
import { ChevronLeft, ChevronRight, Droplets, Sparkles } from 'lucide-react';

interface Carousel3DProps {
  items: WardrobeItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const Carousel3D: React.FC<Carousel3DProps> = ({
  items,
  selectedIndex,
  onSelect
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const handlePrev = useCallback(() => {
    if (selectedIndex > 0) {
      onSelect(selectedIndex - 1);
    }
  }, [selectedIndex, onSelect]);

  const handleNext = useCallback(() => {
    if (selectedIndex < items.length - 1) {
      onSelect(selectedIndex + 1);
    }
  }, [selectedIndex, items.length, onSelect]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = e.touches[0].clientX - touchStartX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    if (dragOffset > 45 && selectedIndex > 0) {
      handlePrev();
    } else if (dragOffset < -45 && selectedIndex < items.length - 1) {
      handleNext();
    }
    setTouchStartX(null);
    setDragOffset(0);
  };

  // Mouse gestures for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setTouchStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || touchStartX === null) return;
    const diff = e.clientX - touchStartX;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging || touchStartX === null) return;
    if (dragOffset > 45 && selectedIndex > 0) {
      handlePrev();
    } else if (dragOffset < -45 && selectedIndex < items.length - 1) {
      handleNext();
    }
    setIsDragging(false);
    setTouchStartX(null);
    setDragOffset(0);
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full py-4 select-none">
      {/* 3D Stage Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[370px] flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing perspective-[1200px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {items.map((item, index) => {
          const offset = index - selectedIndex;
          const isCenter = offset === 0;

          // Render at most 2 items to the left and 2 to the right for optimal performance
          if (Math.abs(offset) > 2) return null;

          // Calculate 3D transforms
          const translateX = offset * 115 + (isDragging ? dragOffset * 0.35 : 0);
          const translateZ = isCenter ? 60 : -40 * Math.abs(offset);
          const rotateY = offset * -20;
          const scale = isCenter ? 1 : 0.82;
          const opacity = isCenter ? 1 : Math.abs(offset) === 1 ? 0.55 : 0.2;
          const zIndex = 30 - Math.abs(offset) * 10;

          return (
            <div
              key={item.id}
              onClick={() => onSelect(index)}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
                opacity,
                zIndex,
                transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease',
                willChange: 'transform, opacity',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',
              }}
              className="absolute w-[220px] h-[310px] rounded-[24px] overflow-hidden bg-[#272A4B] border border-[rgba(242,236,221,0.18)] shadow-[0_20px_45px_-10px_rgba(0,0,0,0.7)] group cursor-pointer transition-shadow"
            >
              {/* Garment Image */}
              <div className="relative w-full h-full bg-[#181A31]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover object-center pointer-events-none group-hover:scale-105 transition-transform duration-500"
                />

                {/* Ambient vignette / overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#181A31]/90 via-[#181A31]/20 to-transparent pointer-events-none" />

                {/* Subtle Laundry Status Indicator (FEATURE 6) */}
                {item.laundryStatus === 'IN_LAUNDRY' && (
                  <div className="absolute top-3 left-3 bg-[#E44C4E]/90 backdrop-blur-md border border-[#E44C4E] text-[#181A31] font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <Droplets className="w-2.5 h-2.5" />
                    <span>IN LAUNDRY</span>
                  </div>
                )}

                {item.laundryStatus === 'READY_TO_WEAR' && (
                  <div className="absolute top-3 left-3 bg-[#CCA166]/90 backdrop-blur-md border border-[#CCA166] text-[#181A31] font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>READY</span>
                  </div>
                )}

                {/* Category chip on card */}
                <div className="absolute top-3 right-3 bg-[#181A31]/80 backdrop-blur-md border border-[rgba(242,236,221,0.15)] text-[#CCA166] font-mono text-[9px] tracking-wider px-2 py-0.5 rounded-full">
                  {item.category}
                </div>

                {/* Bottom title banner on card */}
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <h4 className="font-serif text-sm font-medium text-[#F2ECDD] leading-tight line-clamp-1 drop-shadow-sm">
                    {item.name}
                  </h4>
                  <p className="font-mono text-[10px] text-[#9C9FBE] tracking-tight mt-0.5">
                    {item.colour} · {item.fabric}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sleek left/right navigation controls */}
      <div className="flex items-center justify-between px-6 -mt-2">
        <button
          onClick={handlePrev}
          disabled={selectedIndex === 0}
          aria-label="Previous clothing item"
          className="w-9 h-9 rounded-full bg-[#272A4B]/80 hover:bg-[#3E437A] disabled:opacity-30 disabled:pointer-events-none border border-[rgba(242,236,221,0.15)] flex items-center justify-center text-[#F2ECDD] transition-all shadow-md active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Index indicators */}
        <div className="flex items-center gap-1.5">
          {items.map((_, i) => (
            <div
              key={i}
              onClick={() => onSelect(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === selectedIndex
                  ? 'w-5 bg-[#CCA166]'
                  : 'w-1.5 bg-[rgba(242,236,221,0.2)] hover:bg-[rgba(242,236,221,0.4)]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={selectedIndex === items.length - 1}
          aria-label="Next clothing item"
          className="w-9 h-9 rounded-full bg-[#272A4B]/80 hover:bg-[#3E437A] disabled:opacity-30 disabled:pointer-events-none border border-[rgba(242,236,221,0.15)] flex items-center justify-center text-[#F2ECDD] transition-all shadow-md active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
