import React from 'react';
import { ProductCondition } from '@/types';

interface ConditionBadgeProps {
  condition: ProductCondition;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ConditionBadge: React.FC<ConditionBadgeProps> = ({
  condition,
  className = '',
  size = 'md',
}) => {
  const getStyles = () => {
    switch (condition) {
      case 'Brand New With Tags':
        return 'bg-emerald-900/10 text-emerald-800 border-emerald-800/30';
      case 'Like New':
        return 'bg-teal-900/10 text-teal-800 border-teal-800/30';
      case 'Excellent':
        return 'bg-olive/15 text-olive-500 border-olive/30';
      case 'Good':
        return 'bg-amber-900/10 text-amber-800 border-amber-800/30';
      case 'Vintage':
      default:
        return 'bg-vintage-brown/15 text-vintage-brown border-vintage-brown/30';
    }
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider uppercase',
    md: 'text-xs px-2.5 py-1 tracking-wider uppercase',
    lg: 'text-sm px-3.5 py-1.5 tracking-widest uppercase font-medium',
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-medium border ${sizeClasses[size]} ${getStyles()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {condition}
    </span>
  );
};
