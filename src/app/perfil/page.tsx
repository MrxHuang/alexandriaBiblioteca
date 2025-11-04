'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LoadingScreen } from '@/components/ui/Spinner';
import { Skeleton, SkeletonPrestamoCard } from '@/components/ui/Skeleton';
import { useAuth } from '@/lib/hooks/useAuth';
import { prestamosService } from '@/lib/services/prestamos.service';
import { Prestamo } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, BookOpen, CheckCircle, Clock } from 'lucide-react';
export default function PerfilPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchPrestamos();
    }
  }, [user, isAuthenticated]);

  const fetchPrestamos = async () => {
    try {
      if (!user?.id) return;
      
      const response = await prestamosService.getAll({
        usuarioId: user.id,
        size: 100,
      });
      setPrestamos(response.content);
    } catch (error) {
      console.error('Error fetching préstamos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generar avatar usando servicio online basado en email
  const avatarUrl = user
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email || user.username)}&size=128&backgroundColor=b6e3f4`
    : '';

  // Obtener fecha de creación real de la base de datos
  const accountCreationDate = user?.fechaCreacion
    ? new Date(user.fechaCreacion)
    : new Date(); // Fallback a fecha actual si no está disponible

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const remainingDays = diffDays % 30;

    if (diffMonths === 0) {
      return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    } else if (remainingDays === 0) {
      return `hace ${diffMonths} ${diffMonths === 1 ? 'mes' : 'meses'}`;
    } else {
      return `hace ${diffMonths} ${diffMonths === 1 ? 'mes' : 'meses'} y ${remainingDays} ${remainingDays === 1 ? 'día' : 'días'}`;
    }
  };

  const prestamosActivos = prestamos.filter((p) => !p.devuelto);
  const prestamosDevueltos = prestamos.filter((p) => p.devuelto);

  if (authLoading || !user) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-8 pt-20 pb-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-6xl font-bold mb-4">Mi Perfil</h1>
          <p className="text-2xl text-gray-800">Información de tu cuenta</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información Personal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="bg-gradient-to-br from-white to-gray-50/50 h-full">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl font-bold">Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex justify-center">
                  {loading ? (
                    <Skeleton variant="circular" width="8rem" height="8rem" />
                  ) : (
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg bg-gray-100">
                      <img
                        src={avatarUrl}
                        alt={`Avatar de ${user.nombre}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback a iniciales si falla la imagen
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-600 text-white text-4xl font-bold">${user.nombre.charAt(0).toUpperCase()}</div>`;
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Nombre */}
                <div className="space-y-2">
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton height="1rem" width="40%" />
                      <Skeleton height="1.5rem" width="70%" />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 text-gray-700">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Nombre</p>
                        <span className="text-lg font-semibold text-gray-900">{user.nombre}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton height="1rem" width="50%" />
                      <Skeleton height="1.5rem" width="80%" />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 text-gray-700">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Correo electrónico</p>
                        <span className="text-lg font-semibold text-gray-900">{user.email}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Fecha de creación */}
                <div className="space-y-2">
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton height="1rem" width="45%" />
                      <Skeleton height="1.5rem" width="60%" />
                      <Skeleton height="0.875rem" width="40%" />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 text-gray-700">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Cuenta creada</p>
                        <span className="text-lg font-semibold text-gray-900">
                          {accountCreationDate.toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatTimeAgo(accountCreationDate)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Rol */}
                <div className="pt-4 border-t-2 border-gray-200">
                  {loading ? (
                    <Skeleton height="2rem" width="6rem" className="mx-auto rounded-full" />
                  ) : (
                    <div className="flex items-center justify-center">
                      <span
                        className="px-4 py-2 text-sm font-semibold rounded-full uppercase tracking-wide"
                        style={{
                          backgroundColor: user.rol === 'ADMIN' ? '#dc2626' : '#2563eb',
                          color: '#fff',
                        }}
                      >
                        {user.rol}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Préstamos */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Préstamos Activos */}
            <Card className="bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <Clock className="w-6 h-6 text-gray-600" />
                    Libros Prestados ({prestamosActivos.length})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <SkeletonPrestamoCard key={i} />
                    ))}
                  </div>
                ) : prestamosActivos.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" strokeWidth={1.5} />
                    <p className="text-gray-600 text-lg">No tienes libros prestados actualmente</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {prestamosActivos.map((prestamo, index) => (
                      <motion.div
                        key={prestamo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {prestamo.libro?.titulo || `Libro ID ${prestamo.libroId}`}
                            </h3>
                            {prestamo.libro?.autor && (
                              <p className="text-sm text-gray-600 mb-2">
                                {prestamo.libro.autor.nombre} {prestamo.libro.autor.apellido}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              Prestado el {new Date(prestamo.fechaPrestamo).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Préstamos Devueltos */}
            <Card className="bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    Libros Devueltos ({prestamosDevueltos.length})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <SkeletonPrestamoCard key={i} />
                    ))}
                  </div>
                ) : prestamosDevueltos.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" strokeWidth={1.5} />
                    <p className="text-gray-600 text-lg">No has devuelto ningún libro aún</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {prestamosDevueltos.map((prestamo, index) => (
                      <motion.div
                        key={prestamo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {prestamo.libro?.titulo || `Libro ID ${prestamo.libroId}`}
                            </h3>
                            {prestamo.libro?.autor && (
                              <p className="text-sm text-gray-600 mb-2">
                                {prestamo.libro.autor.nombre} {prestamo.libro.autor.apellido}
                              </p>
                            )}
                            <div className="flex gap-4 text-xs text-gray-500">
                              <span>
                                Prestado: {new Date(prestamo.fechaPrestamo).toLocaleDateString('es-ES')}
                              </span>
                              {prestamo.fechaDevolucion && (
                                <span>
                                  Devuelto: {new Date(prestamo.fechaDevolucion).toLocaleDateString('es-ES')}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                            Devuelto
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
