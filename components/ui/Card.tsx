import React from 'react';
import { cardStyles } from '../../lib/theme';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Card({
  children,
  className = '',
  padding = 'md',
}: CardProps) {
  const paddingStyles = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const combinedClasses = `${cardStyles} ${paddingStyles[padding]} ${className}`.trim();

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
} 