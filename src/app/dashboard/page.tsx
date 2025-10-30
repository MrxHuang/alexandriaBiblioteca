'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BookOpen, BookMarked, TrendingUp } from 'lucide-react';
import { librosService } from '@/lib/services/libros.service';
import { prestamosService } from '@/lib/services/prestamos.service';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalLibros: 0,
    prestamosActivos: 0,
    totalPrestamos: 0,
  });
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [librosData, prestamosData, prestamosActivosData] = await Promise.all([
          librosService.getAll({ page: 0, size: 1 }),
          prestamosService.getAll({ page: 0, size: 1 }),
          prestamosService.getAll({ page: 0, size: 1, devuelto: false }),
        ]);

        setStats({
          totalLibros: librosData.totalElements,
          totalPrestamos: prestamosData.totalElements,
          prestamosActivos: prestamosActivosData.totalElements,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    if (isAuthenticated && !loading) {
      fetchStats();
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-700">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-8 py-16">
        {/* Welcome Section */}
        <div className="mb-16">
          <h1 className="text-6xl font-bold mb-6">Bienvenido, {user?.nombre}</h1>
          <p className="text-2xl text-gray-800">Sistema de Gestión de Biblioteca</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card hover>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Total Libros</CardTitle>
                <BookOpen className="w-12 h-12 text-gray-600" strokeWidth={1.5} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold">{stats.totalLibros}</p>
              <p className="text-lg text-gray-700 mt-4">Libros en el catálogo</p>
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Préstamos Activos</CardTitle>
                <BookMarked className="w-12 h-12 text-gray-600" strokeWidth={1.5} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold">{stats.prestamosActivos}</p>
              <p className="text-lg text-gray-700 mt-4">Libros prestados actualmente</p>
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Total Préstamos</CardTitle>
                <TrendingUp className="w-12 h-12 text-gray-600" strokeWidth={1.5} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold">{stats.totalPrestamos}</p>
              <p className="text-lg text-gray-700 mt-4">Préstamos históricos</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-4xl font-semibold mb-8">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card 
              hover 
              onClick={() => router.push('/libros')}
              className="cursor-pointer"
            >
              <CardContent>
                <div className="flex items-center space-x-6">
                  <BookOpen className="w-16 h-16" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Explorar Libros</h3>
                    <p className="text-lg text-gray-800">Ver el catálogo completo</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              hover 
              onClick={() => router.push('/prestamos')}
              className="cursor-pointer"
            >
              <CardContent>
                <div className="flex items-center space-x-6">
                  <BookMarked className="w-16 h-16" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Gestionar Préstamos</h3>
                    <p className="text-lg text-gray-800">Ver y administrar préstamos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}