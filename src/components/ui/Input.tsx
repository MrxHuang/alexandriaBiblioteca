import React from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-3">
        {label && (
          <label className="block text-lg font-medium text-gray-900">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-6 py-4 text-lg bg-white border-2 border-gray-300',
            'focus:border-black focus:outline-none transition-colors',
            'placeholder:text-gray-500',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-base text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';