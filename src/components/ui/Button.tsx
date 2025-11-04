import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = [
    'font-medium',
    'transition-all duration-300 ease-out',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'cursor-pointer',
    'relative overflow-hidden',
    'group',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    // Transiciones suaves mejoradas
    'transform-gpu',
    'will-change-transform',
  ].join(' ');
  
  const variants = {
    primary: [
      'bg-black text-white',
      'hover:bg-gray-800',
      'active:bg-gray-900',
      'hover:scale-[1.03]',
      'active:scale-[0.97]',
      'hover:shadow-lg hover:shadow-black/20',
      'focus:ring-gray-500',
      // Efecto ripple
      'before:absolute before:inset-0 before:bg-white before:opacity-0',
      'before:transition-opacity before:duration-300',
      'hover:before:opacity-10',
      'active:before:opacity-20',
    ].join(' '),
    secondary: [
      'bg-white text-black border-2 border-black',
      'hover:bg-black hover:text-white',
      'active:bg-gray-900',
      'hover:scale-[1.03]',
      'active:scale-[0.97]',
      'hover:shadow-lg hover:shadow-gray-500/20',
      'focus:ring-gray-500',
      'transition-colors duration-300',
    ].join(' '),
    ghost: [
      'bg-transparent text-black',
      'hover:bg-gray-100',
      'active:bg-gray-200',
      'hover:scale-[1.02]',
      'active:scale-[0.98]',
      'focus:ring-gray-400',
      'transition-colors duration-200',
    ].join(' '),
    danger: [
      'bg-red-600 text-white',
      'hover:bg-red-700',
      'active:bg-red-800',
      'hover:scale-[1.03]',
      'active:scale-[0.97]',
      'hover:shadow-lg hover:shadow-red-500/30',
      'focus:ring-red-500',
      // Efecto ripple
      'before:absolute before:inset-0 before:bg-white before:opacity-0',
      'before:transition-opacity before:duration-300',
      'hover:before:opacity-10',
      'active:before:opacity-20',
    ].join(' '),
  };

  const sizes = {
    sm: 'px-6 py-3 text-base',
    md: 'px-8 py-4 text-lg',
    lg: 'px-12 py-5 text-xl',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}