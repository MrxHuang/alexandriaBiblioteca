'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { BookOpen, Lock, User, ArrowRight, AlertCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ColorBends from '@/components/ui/ColorBends';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@/lib/types';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'google' | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.LECTOR);
  const { login, loginWithGoogle } = useAuth();
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
      {/* Left Side - Decorative with ColorBends */}
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

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md space-y-8"
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
            className="space-y-3 text-center lg:text-left"
          >
            <div className="relative">
              <h2 className="text-4xl font-light tracking-wide text-gray-900 relative z-10">
                Bienvenido
              </h2>
              <div className="absolute -bottom-1 left-0 w-24 h-0.5 bg-gray-900/20"></div>
            </div>
            <p className="text-sm text-gray-600 font-light tracking-wide">Inicia sesión para continuar</p>
          </motion.div>

          {/* Login Form */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            {/* Username Input */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="space-y-2"
            >
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Usuario
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Ingresa tu usuario"
                  className={`w-full px-4 py-3.5 text-sm bg-white border-2 rounded-lg transition-all duration-200 font-light text-gray-900 placeholder:text-gray-400 shadow-sm
                    ${focusedField === 'username' 
                      ? 'border-gray-900 shadow-lg ring-2 ring-gray-900/10' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-gray-900 focus:shadow-lg focus:ring-2 focus:ring-gray-900/10'
                    }`}
                  required
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="space-y-2"
            >
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Ingresa tu contraseña"
                  className={`w-full px-4 py-3.5 text-sm bg-white border-2 rounded-lg transition-all duration-200 font-light text-gray-900 placeholder:text-gray-400 shadow-sm
                    ${focusedField === 'password' 
                      ? 'border-gray-900 shadow-lg ring-2 ring-gray-900/10' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-gray-900 focus:shadow-lg focus:ring-2 focus:ring-gray-900/10'
                    }`}
                  required
                />
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border-2 border-red-200 rounded-lg shadow-sm"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-900">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || oauthLoading !== null}
              className="w-full bg-gray-900 text-white py-3.5 text-sm font-medium hover:bg-gray-800 active:bg-gray-950 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg active:shadow-md cursor-pointer"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </motion.button>
          </motion.form>

          {/* Divider */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="relative my-8"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gradient-to-br from-gray-50 to-white px-4 text-gray-500 font-medium">O continúa con</span>
            </div>
          </motion.div>

          {/* OAuth Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="space-y-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedProvider('google');
                setSelectedRole(UserRole.LECTOR);
                setShowRoleModal(true);
              }}
              disabled={loading || oauthLoading !== null}
              className="w-full flex items-center justify-center gap-3 py-3.5 text-sm font-medium bg-white border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 active:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:shadow-sm rounded-lg shadow-sm cursor-pointer group"
            >
              {oauthLoading === 'google' ? (
                <span className="text-gray-600">Iniciando sesión...</span>
              ) : (
                <>
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium">Continuar con Google</span>
                </>
              )}
            </motion.button>

          </motion.div>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center space-y-3 pt-6 border-t border-gray-200"
          >
            <p className="text-xs text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="text-gray-900 font-semibold hover:text-gray-700 hover:underline transition-colors cursor-pointer">
                Regístrate aquí
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Modal de Selección de Rol */}
      {showRoleModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-8"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => {
              setShowRoleModal(false);
              setSelectedProvider(null);
            }}
            className="absolute inset-0 bg-black/50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white border-2 border-gray-900 w-full max-w-md shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">Selecciona tu tipo de cuenta</h2>
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedProvider(null);
                }}
                className="p-2 hover:bg-gray-100 transition-colors rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <p className="text-gray-600 text-sm">
                Elige el tipo de cuenta que deseas usar para iniciar sesión con Google
              </p>
              
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Tipo de Usuario
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full px-4 py-3.5 text-sm bg-white border-2 rounded-lg transition-all duration-200 font-light text-gray-900 shadow-sm border-gray-200 hover:border-gray-300 focus:border-gray-900 focus:shadow-lg focus:ring-2 focus:ring-gray-900/10"
                >
                  <option value={UserRole.LECTOR}>Lector</option>
                  <option value={UserRole.ADMIN}>Administrador</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowRoleModal(false);
                    setSelectedProvider(null);
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={async () => {
                    if (!selectedProvider) return;
                    
                    setShowRoleModal(false);
                    setError('');
                    setOauthLoading(selectedProvider);
                    
                    try {
                      await loginWithGoogle(selectedRole);
                    } catch (err: any) {
                      setError(err.response?.data?.message || 'Error al iniciar sesión con Google');
                    } finally {
                      setOauthLoading(null);
                      setSelectedProvider(null);
                    }
                  }}
                  className="flex-1"
                >
                  Continuar
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}