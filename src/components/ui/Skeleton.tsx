import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'default' | 'circular' | 'rectangular' | 'text';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  variant = 'default',
  width,
  height,
  animation = 'pulse',
  style,
  ...props
}: SkeletonProps) {
  const baseStyles = 'bg-gray-200';
  
  const variantStyles = {
    default: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    text: 'rounded',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={{
        width: width || '100%',
        height: height || '1rem',
        ...style,
      }}
      {...props}
    />
  );
}

// Skeleton específicos para diferentes componentes

export function SkeletonCard() {
  return (
    <div className="bg-white border-2 border-gray-200 p-8 rounded-xl shadow-lg shadow-gray-200/50">
      <div className="mb-6">
        <Skeleton variant="text" height="1.75rem" width="70%" className="mb-2" />
        <Skeleton variant="text" height="1rem" width="50%" />
      </div>
      <div className="space-y-4">
        <Skeleton variant="rectangular" height="12rem" className="rounded-lg" />
        <Skeleton variant="text" height="1rem" width="80%" />
        <Skeleton variant="text" height="1rem" width="60%" />
      </div>
    </div>
  );
}

export function SkeletonLibroCard() {
  return (
    <div className="bg-white border-2 border-gray-200 p-8 rounded-xl shadow-lg shadow-gray-200/50 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <Skeleton variant="text" height="1.75rem" width="70%" />
        <Skeleton variant="circular" width="3rem" height="3rem" />
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width="2rem" height="2rem" />
          <Skeleton variant="text" height="1rem" width="60%" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width="2rem" height="2rem" />
          <Skeleton variant="text" height="1rem" width="30%" />
        </div>
        <div className="pt-4 mt-4 border-t border-gray-200">
          <Skeleton variant="text" height="0.875rem" width="40%" />
        </div>
        <div className="flex gap-3 mt-6 pt-6 border-t-2 border-gray-100">
          <Skeleton variant="rectangular" height="2.5rem" width="50%" className="rounded-lg" />
          <Skeleton variant="rectangular" height="2.5rem" width="50%" className="rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonAutorCard() {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 border-2 border-gray-200 p-8 rounded-xl shadow-lg shadow-gray-200/50 h-full flex flex-col">
      <div className="mb-6 flex items-start justify-between gap-3">
        <Skeleton variant="text" height="2rem" width="3/4" className="rounded" />
        <Skeleton variant="rectangular" width="3rem" height="3rem" className="rounded-lg" />
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex items-center space-x-3">
          <Skeleton variant="rectangular" width="2rem" height="2rem" className="rounded-md" />
          <Skeleton variant="text" height="1.25rem" width="1/2" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton variant="rectangular" width="2rem" height="2rem" className="rounded-md" />
          <Skeleton variant="text" height="1.25rem" width="1/3" />
        </div>
        <div className="pt-4 mt-4 border-t border-gray-200">
          <Skeleton variant="text" height="1rem" width="2/3" />
        </div>
      </div>
      <div className="flex space-x-3 mt-6 pt-6 border-t-2 border-gray-100">
        <Skeleton variant="rectangular" height="2.5rem" width="50%" className="rounded-lg" />
        <Skeleton variant="rectangular" height="2.5rem" width="50%" className="rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonPrestamoCard() {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 border-2 border-gray-200 p-8 rounded-xl shadow-lg shadow-gray-200/50 h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton variant="text" height="2rem" width="40%" className="rounded" />
        <Skeleton variant="rectangular" height="1.75rem" width="5rem" className="rounded-full" />
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex items-center space-x-3">
          <Skeleton variant="rectangular" width="2rem" height="2rem" className="rounded-md" />
          <Skeleton variant="text" height="1.25rem" width="70%" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton variant="rectangular" width="2rem" height="2rem" className="rounded-md" />
          <Skeleton variant="text" height="1.25rem" width="60%" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton variant="rectangular" width="2rem" height="2rem" className="rounded-md" />
          <Skeleton variant="text" height="1.25rem" width="50%" />
        </div>
      </div>
      <div className="flex space-x-3 mt-6 pt-6 border-t-2 border-gray-100">
        <Skeleton variant="rectangular" height="2.5rem" width="50%" className="rounded-lg" />
        <Skeleton variant="rectangular" height="2.5rem" width="50%" className="rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
      <td className="px-6 py-4">
        <Skeleton variant="text" height="1rem" width="80%" />
      </td>
      <td className="px-6 py-4">
        <Skeleton variant="text" height="1rem" width="60%" />
      </td>
      <td className="px-6 py-4">
        <Skeleton variant="text" height="1rem" width="40%" />
      </td>
      <td className="px-6 py-4">
        <Skeleton variant="rectangular" height="1.5rem" width="4rem" className="rounded-full" />
      </td>
    </tr>
  );
}

export function SkeletonList() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white border-2 border-gray-200 p-4 rounded-lg shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" width="3rem" height="3rem" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" height="1.25rem" width="60%" />
              <Skeleton variant="text" height="1rem" width="40%" />
            </div>
            <Skeleton variant="rectangular" height="2rem" width="6rem" className="rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, i) => (
        <SkeletonLibroCard key={i} />
      ))}
    </div>
  );
}

// Skeleton para búsqueda
export function SkeletonSearchBar() {
  return (
    <div className="relative">
      <Skeleton variant="rectangular" height="3.5rem" className="rounded-lg" />
    </div>
  );
}

// Skeleton para estadísticas
export function SkeletonStatCard() {
  return (
    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl shadow-lg shadow-gray-200/50 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="text" height="1rem" width="50%" />
        <Skeleton variant="circular" width="3rem" height="3rem" />
      </div>
      <Skeleton variant="text" height="2.5rem" width="40%" className="mb-2" />
      <Skeleton variant="text" height="0.875rem" width="60%" />
    </div>
  );
}

// Skeleton para formularios
export function SkeletonFormField() {
  return (
    <div className="space-y-2">
      <Skeleton variant="text" height="0.875rem" width="30%" />
      <Skeleton variant="rectangular" height="3rem" className="rounded-lg" />
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="space-y-6">
      <SkeletonFormField />
      <SkeletonFormField />
      <SkeletonFormField />
      <div className="flex gap-4 pt-4">
        <Skeleton variant="rectangular" height="3rem" width="50%" className="rounded-lg" />
        <Skeleton variant="rectangular" height="3rem" width="50%" className="rounded-lg" />
      </div>
    </div>
  );
}

