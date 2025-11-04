'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  progress?: number; // 0-100
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColor = 'text-gray-600',
  trend,
  progress 
}: StatCardProps) {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (value === 0) {
      setDisplayValue(0);
      return;
    }
    
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, value);
      setDisplayValue(Math.floor(current));
      
      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="bg-gradient-to-br from-white to-gray-50/50 relative overflow-hidden group">
        {/* Efecto de brillo sutil en hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${iconColor.includes('text-') ? '' : ''}`}
            >
              <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={1.5} />
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-baseline gap-2 mb-2">
            <motion.p
              key={displayValue}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-bold"
            >
              {displayValue.toLocaleString()}
            </motion.p>
            {trend && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-sm font-semibold flex items-center gap-1 ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </motion.span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-3">{subtitle}</p>
          
          {progress !== undefined && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    progress > 70 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                    progress > 40 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                    'bg-gradient-to-r from-gray-500 to-gray-600'
                  }`}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{progress}% del total</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

