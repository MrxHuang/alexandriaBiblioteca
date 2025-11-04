'use client';

import React, { useState } from 'react';
import { authService } from '@/lib/services/auth.service';
import { BookOpen, Lock, User, Mail, ArrowRight, AlertCircle, CheckCircle, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserRole, UserStatus } from '@/lib/types';
import ColorBends from '@/components/ui/ColorBends';
import { motion } from 'framer-motion';

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
      {/* Left Side - Register Form */}
      <div className="flex-1 flex items-center justify-center px-8 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-2xl space-y-6 py-6"
        >
          {/* Logo for mobile */}
          <div className="lg:hidden text-center space-y-4">
            <BookOpen className="w-16 h-16 mx-auto text-black drop-shadow-sm" strokeWidth={1} />
            <h1 className="text-4xl font-light tracking-[0.2em]">ALEXANDRIA</h1>
          </div>

          {/* Welcome Text */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-2 text-center lg:text-left"
          >
            <div className="relative">
              <h2 className="text-3xl font-light tracking-wide text-gray-900 relative z-10">
                Crear cuenta
              </h2>
              <div className="absolute -bottom-1 left-0 w-20 h-0.5 bg-gray-900/20"></div>
            </div>
            <p className="text-xs text-gray-600 font-light tracking-wide">Completa el formulario para registrarte</p>
          </motion.div>

          {/* Register Form */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSubmit} 
            className="space-y-4"
          >
            {/* Nombre Input - Full Width */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="space-y-1.5"
            >
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
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
                className={`w-full px-4 py-3 text-sm bg-white border-2 rounded-lg transition-all duration-200 font-light text-gray-900 placeholder:text-gray-400 shadow-sm
                  ${focusedField === 'nombre' 
                    ? 'border-gray-900 shadow-lg ring-2 ring-gray-900/10' 
                    : 'border-gray-200 hover:border-gray-300 focus:border-gray-900 focus:shadow-lg focus:ring-2 focus:ring-gray-900/10'
                  }`}
                required
              />
            </motion.div>

            {/* Username and Email - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="space-y-1.5"
              >
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
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
                  className={`w-full px-4 py-3 text-sm bg-white border-2 rounded-lg transition-all duration-200 font-light text-gray-900 placeholder:text-gray-400 shadow-sm
                    ${focusedField === 'username' 
                      ? 'border-gray-900 shadow-lg ring-2 ring-gray-900/10' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-gray-900 focus:shadow-lg focus:ring-2 focus:ring-gray-900/10'
                    }`}
                  required
                  minLength={3}
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="space-y-1.5"
              >
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
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
                  className={`w-full px-4 py-3 text-sm bg-white border-2 rounded-lg transition-all duration-200 font-light text-gray-900 placeholder:text-gray-400 shadow-sm
                    ${focusedField === 'email' 
                      ? 'border-gray-900 shadow-lg ring-2 ring-gray-900/10' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-gray-900 focus:shadow-lg focus:ring-2 focus:ring-gray-900/10'
                    }`}
                  required
                />
              </motion.div>
            </div>

            {/* Password and Confirm Password - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="space-y-1.5"
              >
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
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
                  className={`w-full px-4 py-3 text-sm bg-white border-2 rounded-lg transition-all duration-200 font-light text-gray-900 placeholder:text-gray-400 shadow-sm
                    ${focusedField === 'password' 
                      ? 'border-gray-900 shadow-lg ring-2 ring-gray-900/10' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-gray-900 focus:shadow-lg focus:ring-2 focus:ring-gray-900/10'
                    }`}
                  required
                  minLength={6}
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="space-y-1.5"
              >
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
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
                  className={`w-full px-4 py-3 text-sm bg-white border-2 rounded-lg transition-all duration-200 font-light text-gray-900 placeholder:text-gray-400 shadow-sm
                    ${focusedField === 'confirmPassword' 
                      ? 'border-gray-900 shadow-lg ring-2 ring-gray-900/10' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-gray-900 focus:shadow-lg focus:ring-2 focus:ring-gray-900/10'
                    }`}
                  required
                />
              </motion.div>
            </div>

            {/* Role Selection */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.9 }}
              className="space-y-1.5"
            >
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Tipo de Usuario
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                onFocus={() => setFocusedField('rol')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 text-sm bg-white border-2 rounded-lg transition-all duration-200 font-light text-gray-900 shadow-sm
                  ${focusedField === 'rol' 
                    ? 'border-gray-900 shadow-lg ring-2 ring-gray-900/10' 
                    : 'border-gray-200 hover:border-gray-300 focus:border-gray-900 focus:shadow-lg focus:ring-2 focus:ring-gray-900/10'
                  }`}
              >
                <option value={UserRole.LECTOR}>Lector</option>
                <option value={UserRole.ADMIN}>Administrador</option>
              </select>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border-2 border-red-200 rounded-lg shadow-sm"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-900">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-green-50 border-2 border-green-200 rounded-lg shadow-sm"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-green-900">¡Registro exitoso! Redirigiendo...</p>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || success}
              className="w-full bg-gray-900 text-white py-3 text-sm font-medium hover:bg-gray-800 active:bg-gray-950 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg active:shadow-md cursor-pointer"
            >
              {loading ? 'Registrando...' : success ? '¡Registrado!' : 'Crear Cuenta'}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center pt-4 border-t border-gray-200"
          >
            <p className="text-xs text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-gray-900 font-semibold hover:text-gray-700 hover:underline transition-colors cursor-pointer">
                Inicia sesión
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Decorative with ColorBends */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* ColorBends Background */}
        <div className="absolute inset-0 z-0">
          <ColorBends
            colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
            rotation={30}
            speed={0.3}
            scale={1.2}
            frequency={1.4}
            warpStrength={1.2}
            mouseInfluence={0}
            parallax={0.6}
            noise={0.05}
            transparent={false}
          />
        </div>
        {/* Content Overlay */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center space-y-6 px-16 relative"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative"
            >
              <BookOpen className="w-24 h-24 mx-auto text-white drop-shadow-lg" strokeWidth={1} />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-6xl font-light text-white tracking-[0.2em] drop-shadow-lg"
            >
              ALEXANDRIA
            </motion.h1>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="h-px bg-white/40 mx-auto"
            />
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="text-lg text-white/90 font-light tracking-wide drop-shadow-md"
            >
              Tu biblioteca digital
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}