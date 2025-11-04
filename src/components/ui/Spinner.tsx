import React from 'react';
import { cn } from '@/lib/utils/cn';
import styles from './RocketLoader.module.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = {
    sm: 'scale-50',
    md: 'scale-100',
    lg: 'scale-150',
  };

  return (
    <div className={cn('relative', sizes[size], className)}>
      <div className={styles.loader}>
        <span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </span>
        <div className={styles.base}>
          <span></span>
          <div className={styles.face}></div>
        </div>
      </div>
      <div className={styles.longfazers}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <Spinner size="md" />
      </div>
      <p className="mt-8 text-2xl font-semibold text-gray-900">Cargando...</p>
    </div>
  );
}