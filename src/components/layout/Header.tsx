'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '../ui/Button';
import { BookOpen, LogOut, User } from 'lucide-react';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="border-b-2 border-gray-300 bg-white">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-4 group">
            <BookOpen className="w-10 text-gray-900 h-10" strokeWidth={1.5} />
            <span className="text-3xl text-gray-900  font-bold tracking-tight">ALEXANDRIA</span>
          </Link>

          {isAuthenticated && (
            <div className="flex items-center space-x-8">
              <nav className="flex items-center space-x-8">
                <Link 
                  href="/dashboard" 
                  className="text-lg text-gray-900 hover:text-black transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/libros" 
                  className="text-lg text-gray-900 hover:text-black transition-colors"
                >
                  Libros
                </Link>
                <Link 
                  href="/autores" 
                  className="text-lg text-gray-900 hover:text-black transition-colors"
                >
                  Autores
                </Link>
                <Link 
                  href="/prestamos" 
                  className="text-lg text-gray-900 hover:text-black transition-colors"
                >
                  Préstamos
                </Link>
              </nav>

              <div className="flex items-center space-x-6 border-l-2 border-gray-300 pl-8">
                <div className="flex items-center space-x-3">
                  <User className="w-5 text-gray-900 h-5" />
                  <span className="text-lg font-medium text-gray-900">{user?.nombre}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Salir</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}