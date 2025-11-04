'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/Spinner';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { librosService } from '@/lib/services/libros.service';
import { prestamosService } from '@/lib/services/prestamos.service';
import { Libro } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';
import { BookOpen, Calendar, User } from 'lucide-react';

export default function LibroDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [libro, setLibro] = useState<Libro | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { isAuthenticated, isLector, loading: authLoading, user } = useAuth();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const load = async () => {
      try {
        if (!params?.id) return;
        const data = await librosService.getById(Number(params.id));
        setLibro(data);
      } catch (e) {
        console.error('Error cargando libro', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params?.id]);

  const solicitarPrestamo = async () => {
    if (!user || !libro) return;
    setCreating(true);
    try {
      await prestamosService.create({ libroId: libro.id, usuarioId: user.id });
      showSuccess('Préstamo solicitado con éxito');
      setTimeout(() => {
        router.push('/prestamos');
      }, 1000);
    } catch (e) {
      console.error('Error creando préstamo', e);
      const anyErr = e as any;
      const message = anyErr?.response?.data?.message as string | undefined;
      if (message) {
        // Mensajes del backend: libro prestado o límite de préstamos
        showError(message);
      } else {
        showError('No se pudo crear el préstamo');
      }
    } finally {
      setCreating(false);
    }
  };

  if (authLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-8 pt-20 pb-16">
        <div className="mb-10">
          {loading ? (
            <>
              <Skeleton height="4rem" width="70%" className="mb-4" />
              <Skeleton height="1.75rem" width="40%" />
            </>
          ) : libro ? (
            <>
              <h1 className="text-6xl font-bold mb-2">{libro.titulo}</h1>
              <p className="text-2xl text-gray-800">Detalles del libro</p>
            </>
          ) : (
            <>
              <h1 className="text-6xl font-bold mb-2">Libro no encontrado</h1>
              <p className="text-2xl text-gray-800">El libro solicitado no existe</p>
            </>
          )}
        </div>

        {loading ? (
          <SkeletonCard />
        ) : libro ? (
          <Card className="bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Información</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="flex items-center space-x-4 text-gray-800">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-colors duration-200 hover:bg-gray-200">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Autor</p>
                    <span className="text-lg font-semibold">
                      {libro.autor ? `${libro.autor.nombre} ${libro.autor.apellido}` : `Autor ID ${libro.autorId}`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-gray-800">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-colors duration-200 hover:bg-gray-200">
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Año de publicación</p>
                    <span className="text-lg font-semibold">{libro.anio}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-gray-800">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-colors duration-200 hover:bg-gray-200">
                    <BookOpen className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">ISBN</p>
                    <span className="text-lg font-mono font-semibold">{libro.isbn}</span>
                  </div>
                </div>
              </div>

              {isLector && (
                <div className="mt-10 pt-8 border-t-2 border-gray-200">
                  <Button onClick={solicitarPrestamo} disabled={creating} size="lg" className="w-full">
                    {creating ? 'Solicitando…' : 'Solicitar préstamo'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  );
}


