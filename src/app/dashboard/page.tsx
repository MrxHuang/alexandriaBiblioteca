'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BookOpen, BookMarked, TrendingUp, Users, Clock, CheckCircle, Plus, Library, Shield, Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { librosService } from '@/lib/services/libros.service';
import { prestamosService } from '@/lib/services/prestamos.service';
import { usuariosService } from '@/lib/services/usuarios.service';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Prestamo, Libro } from '@/lib/types';
import { LoadingScreen } from '@/components/ui/Spinner';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalLibros: 0,
    prestamosActivos: 0,
    totalPrestamos: 0,
    totalUsuarios: 0,
    prestamosPendientes: 0,
  });
  const [misPrestamos, setMisPrestamos] = useState<Prestamo[]>([]);
  const [librosRecientes, setLibrosRecientes] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, loading: authLoading, user, isAdmin, isLector } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAdmin) {
          // Para admin: estadísticas globales
          const [librosData, prestamosData, prestamosActivosData, usuariosData] = await Promise.all([
            librosService.getAll({ page: 0, size: 1 }),
            prestamosService.getAll({ page: 0, size: 1 }),
            prestamosService.getAll({ page: 0, size: 1, devuelto: false }),
            usuariosService.getAll({ page: 0, size: 1 }),
          ]);

          setStats({
            totalLibros: librosData.totalElements,
            totalPrestamos: prestamosData.totalElements,
            prestamosActivos: prestamosActivosData.totalElements,
            totalUsuarios: usuariosData.totalElements,
            prestamosPendientes: prestamosActivosData.totalElements,
          });
        } else {
          // Para lector: estadísticas personales
          if (!user?.id) return;

          const [librosData, misPrestamosData, misPrestamosActivosData, misPrestamosDevueltosData] = await Promise.all([
            librosService.getAll({ page: 0, size: 1 }),
            prestamosService.getAll({ page: 0, size: 1, usuarioId: user.id }),
            prestamosService.getAll({ page: 0, size: 5, usuarioId: user.id, devuelto: false }),
            prestamosService.getAll({ page: 0, size: 1, usuarioId: user.id, devuelto: true }),
          ]);

          setStats({
            totalLibros: librosData.totalElements,
            totalPrestamos: misPrestamosData.totalElements,
            prestamosActivos: misPrestamosActivosData.totalElements,
            totalUsuarios: 0,
            prestamosPendientes: misPrestamosActivosData.totalElements,
          });

          setMisPrestamos(misPrestamosActivosData.content);
        }

        // Libros recientes para ambos
        const librosRecientesData = await librosService.getAll({ page: 0, size: 6 });
        setLibrosRecientes(librosRecientesData.content);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && !authLoading) {
      fetchData();
    }
  }, [isAuthenticated, authLoading, user, isAdmin]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getPersonalizedMessage = () => {
    if (isAdmin) {
      return 'Panel de administración del sistema';
    }
    if (stats.prestamosActivos > 0) {
      return `Tienes ${stats.prestamosActivos} ${stats.prestamosActivos === 1 ? 'libro prestado' : 'libros prestados'}`;
    }
    return 'Explora nuestro catálogo y encuentra tu próximo libro favorito';
  };

  if (loading || authLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-16">
        {/* Welcome Section - Personalizado */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-gray-900">
                {getGreeting()}, {user?.nombre?.split(' ')[0] || user?.nombre}
              </h1>
              <p className="text-xl text-gray-600 mt-2">{getPersonalizedMessage()}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid - Diferente para Admin y Lector */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {isAdmin ? (
            <>
              {/* Admin Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card hover className="bg-gradient-to-br from-white to-gray-50/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold">Total Libros</CardTitle>
                      <Library className="w-10 h-10 text-gray-600" strokeWidth={1.5} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{stats.totalLibros}</p>
                    <p className="text-sm text-gray-600 mt-2">En el catálogo</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card hover className="bg-gradient-to-br from-white to-gray-50/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold">Usuarios</CardTitle>
                      <Users className="w-10 h-10 text-gray-600" strokeWidth={1.5} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{stats.totalUsuarios}</p>
                    <p className="text-sm text-gray-600 mt-2">Usuarios registrados</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card hover className="bg-gradient-to-br from-white to-gray-50/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold">Préstamos Activos</CardTitle>
                      <Clock className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-blue-600">{stats.prestamosActivos}</p>
                    <p className="text-sm text-gray-600 mt-2">Pendientes de devolución</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card hover className="bg-gradient-to-br from-white to-gray-50/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold">Total Préstamos</CardTitle>
                      <TrendingUp className="w-10 h-10 text-gray-600" strokeWidth={1.5} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{stats.totalPrestamos}</p>
                    <p className="text-sm text-gray-600 mt-2">Históricos</p>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          ) : (
            <>
              {/* Lector Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card hover className="bg-gradient-to-br from-white to-gray-50/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold">Mis Préstamos</CardTitle>
                      <BookMarked className="w-10 h-10 text-gray-600" strokeWidth={1.5} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{stats.prestamosActivos}</p>
                    <p className="text-sm text-gray-600 mt-2">Actualmente en préstamo</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card hover className="bg-gradient-to-br from-white to-gray-50/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold">Total Préstamos</CardTitle>
                      <TrendingUp className="w-10 h-10 text-gray-600" strokeWidth={1.5} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{stats.totalPrestamos}</p>
                    <p className="text-sm text-gray-600 mt-2">Histórico personal</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card hover className="bg-gradient-to-br from-white to-gray-50/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold">Libros Disponibles</CardTitle>
                      <BookOpen className="w-10 h-10 text-gray-600" strokeWidth={1.5} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{stats.totalLibros}</p>
                    <p className="text-sm text-gray-600 mt-2">En el catálogo</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card hover 
                  onClick={() => router.push('/perfil')}
                  className="bg-gradient-to-br from-white to-gray-50/50 cursor-pointer"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold">Mi Perfil</CardTitle>
                      <Shield className="w-10 h-10 text-gray-600" strokeWidth={1.5} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mt-2">Ver mi información</p>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Contenido específico por rol */}
        {isLector && misPrestamos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-semibold mb-6 flex items-center gap-3">
              <Clock className="w-8 h-8 text-gray-600" />
              Mis Préstamos Activos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {misPrestamos.map((prestamo, index) => (
                <motion.div
                  key={prestamo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card 
                    hover 
                    onClick={() => router.push(`/libros/${prestamo.libroId}`)}
                    className="bg-gradient-to-br from-white to-gray-50/50 cursor-pointer"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold line-clamp-2">
                        {prestamo.libro?.titulo || `Libro ID ${prestamo.libroId}`}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {prestamo.libro?.autor && (
                        <p className="text-sm text-gray-600 mb-3">
                          {prestamo.libro.autor.nombre} {prestamo.libro.autor.apellido}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>Prestado el {new Date(prestamo.fechaPrestamo).toLocaleDateString('es-ES')}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Libros Recientes / Recomendados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-4xl font-semibold flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-gray-600" />
              {isAdmin ? 'Libros del Catálogo' : 'Libros Recomendados'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/libros')}
              className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {librosRecientes.slice(0, 6).map((libro, index) => (
              <motion.div
                key={libro.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card 
                  hover 
                  onClick={() => router.push(`/libros/${libro.id}`)}
                  className="bg-gradient-to-br from-white to-gray-50/50 cursor-pointer h-full"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold line-clamp-2">{libro.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {libro.autor && (
                      <p className="text-sm text-gray-600 mb-2">
                        {libro.autor.nombre} {libro.autor.apellido}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Año: {libro.anio}</span>
                      <span className="font-mono">{libro.isbn}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions - Diferentes para Admin y Lector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <h2 className="text-4xl font-semibold mb-8">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                hover 
                onClick={() => router.push('/libros')}
                className="cursor-pointer bg-gradient-to-br from-white to-gray-50/50"
              >
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Explorar Libros</h3>
                      <p className="text-sm text-gray-600">Ver catálogo completo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                hover 
                onClick={() => router.push('/prestamos')}
                className="cursor-pointer bg-gradient-to-br from-white to-gray-50/50"
              >
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <BookMarked className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">
                        {isAdmin ? 'Gestionar Préstamos' : 'Mis Préstamos'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {isAdmin ? 'Administrar todos los préstamos' : 'Ver mis préstamos'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {isAdmin ? (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    hover 
                    onClick={() => router.push('/autores')}
                    className="cursor-pointer bg-gradient-to-br from-white to-gray-50/50"
                  >
                    <CardContent>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-1">Gestionar Autores</h3>
                          <p className="text-sm text-gray-600">Administrar autores</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  hover 
                  onClick={() => router.push('/perfil')}
                  className="cursor-pointer bg-gradient-to-br from-white to-gray-50/50"
                >
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-1">Mi Perfil</h3>
                        <p className="text-sm text-gray-600">Ver mi información</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}