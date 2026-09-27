'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import './ProfileCard.css';
import { useTheme } from '@/context/ThemeContext';

export interface ProfileCardProps {
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  avatarUrl?: string;
  showUserInfo?: boolean;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  onContactClick?: () => void;
  iconUrl?: string;
  behindGlowEnabled?: boolean;
  innerGradient?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ProfileCard({
  name = 'Milanista Curator',
  title = 'Fashion Enthusiast',
  handle = 'milanista',
  status = 'Styling Active',
  contactText = 'Connect',
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
  showUserInfo = true,
  enableTilt = true,
  enableMobileTilt = false,
  onContactClick,
  iconUrl,
  behindGlowEnabled = true,
  innerGradient = 'linear-gradient(145deg, rgba(228, 76, 78, 0.25) 0%, rgba(204, 161, 102, 0.2) 50%, rgba(24, 26, 49, 0.8) 100%)',
  className = '',
  style = {},
}: ProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!enableTilt || !cardRef.current) return;
      if (e.pointerType === 'touch' && !enableMobileTilt) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;
      const fromLeft = x / rect.width;
      const fromTop = y / rect.height;

      const deltaX = fromLeft - 0.5;
      const deltaY = fromTop - 0.5;
      const distFromCenter = Math.min(1, Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 2);

      const rotX = -deltaY * 26; // rotate along X-axis
      const rotY = deltaX * 26;  // rotate along Y-axis

      const el = cardRef.current;
      el.style.setProperty('--pointer-x', `${px.toFixed(2)}%`);
      el.style.setProperty('--pointer-y', `${py.toFixed(2)}%`);
      el.style.setProperty('--pointer-from-center', distFromCenter.toFixed(3));
      el.style.setProperty('--pointer-from-left', fromLeft.toFixed(3));
      el.style.setProperty('--pointer-from-top', fromTop.toFixed(3));
      el.style.setProperty('--rotate-x', `${rotY.toFixed(2)}deg`);
      el.style.setProperty('--rotate-y', `${rotX.toFixed(2)}deg`);
      el.style.setProperty('--background-x', `${px.toFixed(2)}%`);
      el.style.setProperty('--background-y', `${py.toFixed(2)}%`);
      el.style.setProperty('--card-opacity', '1');
    },
    [enableTilt, enableMobileTilt]
  );

  const handlePointerEnter = useCallback(() => {
    setIsActive(true);
    setIsEntering(true);
    setTimeout(() => setIsEntering(false), 200);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsActive(false);
    if (!cardRef.current) return;
    const el = cardRef.current;
    el.style.setProperty('--card-opacity', '0');
    el.style.setProperty('--rotate-x', '0deg');
    el.style.setProperty('--rotate-y', '0deg');
    el.style.setProperty('--pointer-from-center', '0');
  }, []);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const resolvedGradient = !isDark
    ? 'linear-gradient(145deg, rgba(228, 76, 78, 0.16) 0%, rgba(204, 161, 102, 0.14) 50%, rgba(255, 255, 255, 0.95) 100%)'
    : innerGradient;

  const customStyles: React.CSSProperties = {
    ...style,
    ...(iconUrl ? ({ '--icon': `url(${iconUrl})` } as React.CSSProperties) : {}),
    ...(resolvedGradient ? ({ '--inner-gradient': resolvedGradient } as React.CSSProperties) : {}),
  };

  return (
    <div
      ref={cardRef}
      className={`pc-card-wrapper ${isActive ? 'active' : ''} ${className}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={customStyles}
    >
      {behindGlowEnabled && <div className="pc-behind" />}

      <div className={`pc-card-shell ${isEntering ? 'entering' : ''}`}>
        <div className={`pc-card ${isActive ? 'active' : ''}`}>
          <div className="pc-inside" />
          <div className="pc-shine" />
          <div className="pc-glare" />

          {/* Avatar visual */}
          <div className="pc-avatar-content">
            <img src={avatarUrl} alt={name} className="avatar" />
          </div>

          {/* Editorial name/title on top */}
          <div className="pc-content">
            <div className="pc-details">
              <h3>{name}</h3>
              <p>{title}</p>
            </div>
          </div>

          {/* Glass footer info bar */}
          {showUserInfo && (
            <div className="pc-user-info">
              <div className="pc-user-details">
                <div className="pc-mini-avatar">
                  <img src={avatarUrl} alt={name} />
                </div>
                <div className="pc-user-text">
                  <span className="pc-handle">@{handle}</span>
                  <span className="pc-status">● {status}</span>
                </div>
              </div>
              <button
                type="button"
                className="pc-contact-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onContactClick?.();
                }}
              >
                {contactText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
