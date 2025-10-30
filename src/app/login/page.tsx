'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { BookOpen, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ username, password });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Credenciales incorrectas');
      } else {
        setError('Credenciales incorrectas');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-6 px-16">
            <BookOpen className="w-24 h-24 mx-auto text-white" strokeWidth={1} />
            <h1 className="text-6xl font-light text-white tracking-[0.2em]">
              ALEXANDRIA
            </h1>
            <div className="w-16 h-px bg-white/30 mx-auto" />
            <p className="text-lg text-white/70 font-light tracking-wide">
              Tu biblioteca digital
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 overflow-hidden">
        <div className="w-full max-w-md space-y-8">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center space-y-4">
            <BookOpen className="w-16 h-16 mx-auto text-black" strokeWidth={1} />
            <h1 className="text-4xl font-light tracking-[0.2em]">ALEXANDRIA</h1>
          </div>

          {/* Welcome Text */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-light tracking-wide">Bienvenido</h2>
            <p className="text-sm text-gray-700">Inicia sesión para continuar</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-800 uppercase tracking-wide">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                placeholder="Ingresa tu usuario"
                className="w-full px-4 py-3 text-sm bg-white border border-gray-300 focus:border-black focus:outline-none transition-colors font-light text-gray-900 placeholder:text-gray-500"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-800 uppercase tracking-wide">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-3 text-sm bg-white border border-gray-300 focus:border-black focus:outline-none transition-colors font-light text-gray-900 placeholder:text-gray-500"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-300">
                <p className="text-xs text-red-900">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center space-y-3 pt-4 border-t border-gray-300">
            <p className="text-xs text-gray-800">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="text-black font-medium hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}