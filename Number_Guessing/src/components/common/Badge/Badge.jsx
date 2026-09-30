import React from 'react';
import './Badge.css';

export function Badge({
  children,
  variant = 'default', // 'default' | 'success' | 'warning' | 'danger' | 'cyan' | 'purple' | 'hot' | 'cold' | 'boiling' | 'freezing'
  size = 'md',
  className = '',
  icon: Icon,
}) {
  return (
    <span className={`custom-badge badge-${variant} badge-sz-${size} ${className}`}>
      {Icon && <Icon size={size === 'sm' ? 12 : 14} className="badge-icon" />}
      <span>{children}</span>
    </span>
  );
}
