'use client';

import React from 'react';
import './StarBorder.css';
import { useTheme } from '@/context/ThemeContext';

export interface StarBorderProps {
  as?: React.ElementType;
  className?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const StarBorder: React.FC<StarBorderProps> = ({
  as: Component = 'button',
  className = '',
  color = '#CCA166',
  speed = '6s',
  thickness = 1,
  backgroundColor,
  textColor,
  borderColor,
  children,
  onClick,
  type = 'button',
  disabled = false,
  style = {},
  ...rest
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  let resolvedBg = backgroundColor;
  if (!resolvedBg) {
    resolvedBg = isDark ? '#181A31' : '#FFFFFF';
  } else if (!isDark) {
    if (resolvedBg === '#181A31' || resolvedBg === '#272A4B') {
      resolvedBg = '#FFFFFF';
    }
  }

  let resolvedText = textColor;
  if (!resolvedText) {
    resolvedText = isDark ? '#F2ECDD' : '#181A31';
  } else if (!isDark) {
    if (resolvedText === '#F2ECDD' || resolvedText === '#ffffff') {
      resolvedText = '#181A31';
    }
  }

  const resolvedBorder = borderColor || (isDark ? 'rgba(242,236,221,0.15)' : 'rgba(24,26,49,0.12)');

  return (
    <Component
      className={`star-border-container ${className} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      style={{
        padding: `${thickness}px 0`,
        ...style
      }}
      onClick={onClick}
      type={Component === 'button' ? type : undefined}
      disabled={disabled}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      />
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      />
      <div
        className="inner-content"
        style={{
          background: resolvedBg,
          color: resolvedText,
          borderColor: resolvedBorder
        }}
      >
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
