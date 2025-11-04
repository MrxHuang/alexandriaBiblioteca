'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import {
  Skeleton,
  SkeletonCard,
  SkeletonLibroCard,
  SkeletonAutorCard,
  SkeletonPrestamoCard,
  SkeletonTableRow,
  SkeletonList,
  SkeletonGrid,
  SkeletonSearchBar,
  SkeletonStatCard,
  SkeletonForm,
} from '@/components/ui/Skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';

export default function SkeletonDemoPage() {
  const [showSkeletons, setShowSkeletons] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-8 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <h1 className="text-5xl font-bold text-gray-900">
              Skeleton Loaders - Demo
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Visualización de todos los skeleton loaders personalizados disponibles
          </p>
          <Button
            onClick={() => setShowSkeletons(!showSkeletons)}
            variant="secondary"
            className="mt-4"
          >
            {showSkeletons ? 'Ocultar' : 'Mostrar'} Skeletons
          </Button>
        </motion.div>

        {showSkeletons && (
          <div className="space-y-16">
            {/* Basic Skeleton */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Skeleton Básico</h2>
              <Card>
                <CardContent className="p-8 space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Variantes:</p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Skeleton variant="default" width="100%" height="1rem" />
                        <p className="text-xs text-gray-500">Default</p>
                      </div>
                      <div className="space-y-2">
                        <Skeleton variant="circular" width="3rem" height="3rem" />
                        <p className="text-xs text-gray-500">Circular</p>
                      </div>
                      <div className="space-y-2">
                        <Skeleton variant="rectangular" width="100%" height="4rem" />
                        <p className="text-xs text-gray-500">Rectangular</p>
                      </div>
                      <div className="space-y-2">
                        <Skeleton variant="text" width="100%" height="1rem" />
                        <p className="text-xs text-gray-500">Text</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-6">
                    <p className="text-sm font-medium text-gray-700">Animaciones:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Skeleton animation="pulse" width="100%" height="2rem" />
                        <p className="text-xs text-gray-500">Pulse</p>
                      </div>
                      <div className="space-y-2">
                        <Skeleton animation="wave" width="100%" height="2rem" />
                        <p className="text-xs text-gray-500">Wave (Shimmer)</p>
                      </div>
                      <div className="space-y-2">
                        <Skeleton animation="none" width="100%" height="2rem" />
                        <p className="text-xs text-gray-500">None</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Libro Cards */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Skeleton Cards de Libros</h2>
              <SkeletonGrid count={3} />
            </section>

            {/* Autor Cards */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Skeleton Cards de Autores</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <SkeletonAutorCard key={i} />
                ))}
              </div>
            </section>

            {/* Prestamo Cards */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Skeleton Cards de Préstamos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <SkeletonPrestamoCard key={i} />
                ))}
              </div>
            </section>

            {/* Search Bar */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Skeleton Barra de Búsqueda</h2>
              <Card>
                <CardContent className="p-8">
                  <SkeletonSearchBar />
                </CardContent>
              </Card>
            </section>

            {/* Stat Cards */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Skeleton Cards de Estadísticas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <SkeletonStatCard key={i} />
                ))}
              </div>
            </section>

            {/* List */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Skeleton Lista</h2>
              <Card>
                <CardContent className="p-8">
                  <SkeletonList />
                </CardContent>
              </Card>
            </section>

            {/* Table */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Skeleton Tabla</h2>
              <Card>
                <CardContent className="p-0 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Título
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Autor
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Año
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, i) => (
                        <SkeletonTableRow key={i} />
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </section>

            {/* Form */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Skeleton Formulario</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Formulario de Ejemplo</CardTitle>
                </CardHeader>
                <CardContent>
                  <SkeletonForm />
                </CardContent>
              </Card>
            </section>

            {/* Generic Card */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Skeleton Card Genérico</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

