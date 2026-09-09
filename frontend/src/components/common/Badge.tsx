import React from 'react';
import { ShieldAlert, ShieldCheck, Tag, Info } from 'lucide-react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'gold' | 'neutral';
  icon?: 'check' | 'alert' | 'tag' | 'info';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  icon,
  children,
  className = '',
  size = 'md',
}) => {
  const variantStyles = {
    success: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
    warning: 'bg-amber-950/80 text-amber-300 border-amber-700/60',
    danger: 'bg-red-950/80 text-red-300 border-red-700/60',
    info: 'bg-sky-950/80 text-sky-300 border-sky-700/60',
    gold: 'bg-amber-900/40 text-savanna-gold border-amber-600/50',
    neutral: 'bg-nature-850 text-nature-300 border-nature-700/60',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const renderIcon = () => {
    switch (icon) {
      case 'check':
        return <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400 inline-block" />;
      case 'alert':
        return <ShieldAlert className="w-3.5 h-3.5 mr-1 text-amber-400 inline-block" />;
      case 'tag':
        return <Tag className="w-3 h-3 mr-1 text-nature-400 inline-block" />;
      case 'info':
        return <Info className="w-3.5 h-3.5 mr-1 text-sky-400 inline-block" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full font-mono tracking-wide ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {renderIcon()}
      {children}
    </span>
  );
};
