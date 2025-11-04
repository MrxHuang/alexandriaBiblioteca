import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border-2 border-gray-200 p-8 rounded-xl',
        'shadow-lg shadow-gray-200/50',
        'transition-all duration-300 ease-out',
        'backdrop-blur-sm',
        'relative overflow-hidden',
        // Hover states mejorados
        hover && [
          'cursor-pointer',
          'hover:border-gray-300',
          'hover:shadow-2xl hover:shadow-gray-300/70',
          'hover:-translate-y-2',
          'hover:scale-[1.02]',
          // Efecto de brillo sutil en hover
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
          'before:-translate-x-full before:transition-transform before:duration-700',
          'hover:before:translate-x-full'
        ],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mb-6', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-2xl font-semibold text-black', className)}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  );
}