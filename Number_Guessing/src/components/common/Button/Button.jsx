import React from 'react';
import './Button.css';

export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost' | 'glass'
  size = 'md',        // 'sm' | 'md' | 'lg' | 'icon'
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  icon: Icon,
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon className="btn-icon" size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
      {children && <span className="btn-text">{children}</span>}
    </button>
  );
}
