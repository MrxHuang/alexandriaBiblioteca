'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastComponent: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100/50',
      border: 'border-green-300',
      icon: 'text-green-600',
      text: 'text-green-900',
      shadow: 'shadow-green-200/50',
    },
    error: {
      bg: 'bg-gradient-to-br from-red-50 to-red-100/50',
      border: 'border-red-300',
      icon: 'text-red-600',
      text: 'text-red-900',
      shadow: 'shadow-red-200/50',
    },
    warning: {
      bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100/50',
      border: 'border-yellow-300',
      icon: 'text-yellow-600',
      text: 'text-yellow-900',
      shadow: 'shadow-yellow-200/50',
    },
    info: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50',
      border: 'border-blue-300',
      icon: 'text-blue-600',
      text: 'text-blue-900',
      shadow: 'shadow-blue-200/50',
    },
  };

  const Icon = icons[toast.type];
  const colorScheme = colors[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, x: 100 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`
        flex items-center gap-4 p-5 rounded-xl border-2 backdrop-blur-sm
        ${colorScheme.bg} ${colorScheme.border} ${colorScheme.shadow}
        shadow-lg min-w-[320px] max-w-md
      `}
    >
      <div className={`flex-shrink-0 ${colorScheme.icon}`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className={`flex-1 font-semibold text-base ${colorScheme.text}`}>
        {toast.message}
      </p>
      <button
        onClick={() => onClose(toast.id)}
        className={`
          flex-shrink-0 p-1 rounded-lg hover:bg-white/50 transition-colors
          ${colorScheme.icon} cursor-pointer
        `}
        aria-label="Cerrar"
      >
        <X className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-20 right-8 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastComponent toast={toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

