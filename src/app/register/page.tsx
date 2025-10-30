'use client';

import React, { useState } from 'react';
import { authService } from '@/lib/services/auth.service';
import { BookOpen, Lock, User, Mail, ArrowRight, AlertCircle, CheckCircle, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserRole, UserStatus } from '@/lib/types';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: UserRole.LECTOR,
    estado: UserStatus.ACTIVO,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        nombre: formData.nombre,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        rol: formData.rol,
        estado: UserStatus.ACTIVO,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Error al registrar usuario');
      } else {
        setError('Error al registrar usuario');
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

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center px-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 py-8">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center space-y-4">
            <BookOpen className="w-16 h-16 mx-auto text-black" strokeWidth={1} />
            <h1 className="text-4xl font-light tracking-[0.2em]">ALEXANDRIA</h1>
          </div>

          {/* Welcome Text */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-light tracking-wide">Crear cuenta</h2>
            <p className="text-sm text-gray-700">Completa el formulario para registrarte</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-800 uppercase tracking-wide">
                Nombre Completo
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                onFocus={() => setFocusedField('nombre')}
                onBlur={() => setFocusedField(null)}
                placeholder="Juan Pérez"
                className="w-full px-4 py-3 text-sm bg-white border border-gray-300 focus:border-black focus:outline-none transition-colors font-light text-gray-900 placeholder:text-gray-500"
                required
              />
            </div>

            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-800 uppercase tracking-wide">
                Usuario
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                placeholder="juanperez"
                className="w-full px-4 py-3 text-sm bg-white border border-gray-300 focus:border-black focus:outline-none transition-colors font-light text-gray-900 placeholder:text-gray-500"
                required
                minLength={3}
              />
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-800 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="juan@ejemplo.com"
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 text-sm bg-white border border-gray-300 focus:border-black focus:outline-none transition-colors font-light text-gray-900 placeholder:text-gray-500"
                required
                minLength={6}
              />
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-800 uppercase tracking-wide">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                placeholder="Repite tu contraseña"
                className="w-full px-4 py-3 text-sm bg-white border border-gray-300 focus:border-black focus:outline-none transition-colors font-light text-gray-900 placeholder:text-gray-500"
                required
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-800 uppercase tracking-wide">
                Tipo de Usuario
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm bg-white border border-gray-300 focus:border-black focus:outline-none transition-colors font-light text-gray-900"
              >
                <option value={UserRole.LECTOR}>Lector</option>
                <option value={UserRole.ADMIN}>Administrador</option>
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-300">
                <p className="text-xs text-red-900">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-50 border border-green-300">
                <p className="text-xs text-green-900">¡Registro exitoso! Redirigiendo...</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              {loading ? 'Registrando...' : success ? '¡Registrado!' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center space-y-3 pt-4 border-t border-gray-300">
            <p className="text-xs text-gray-800">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-black font-medium hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}