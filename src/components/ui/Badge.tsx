import React from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-300',
    success: 'bg-green-50 text-green-800 border-green-300',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-300',
    danger: 'bg-red-50 text-red-800 border-red-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-4 py-2 text-base font-medium border-2',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}