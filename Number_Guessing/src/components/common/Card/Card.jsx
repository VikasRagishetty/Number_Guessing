import React from 'react';
import './Card.css';

export function Card({
  children,
  className = '',
  glow = false,
  glowColor = 'primary', // 'primary' | 'fire' | 'cyan' | 'success'
  hoverEffect = false,
  padding = 'md', // 'none' | 'sm' | 'md' | 'lg'
  ...props
}) {
  return (
    <div
      className={`custom-card glass-panel pad-${padding} ${glow ? `glow-${glowColor}` : ''} ${
        hoverEffect ? 'hover-elevate' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
