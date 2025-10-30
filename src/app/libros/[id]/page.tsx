'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/Spinner';
import { librosService } from '@/lib/services/libros.service';
import { prestamosService } from '@/lib/services/prestamos.service';
import { Libro } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import { BookOpen, Calendar, User } from 'lucide-react';

export default function LibroDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [libro, setLibro] = useState<Libro | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { isAuthenticated, isLector, loading: authLoading, user } = useAuth();

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
      alert('Préstamo solicitado con éxito');
      router.push('/prestamos');
    } catch (e) {
      console.error('Error creando préstamo', e);
      alert('No se pudo crear el préstamo');
    } finally {
      setCreating(false);
    }
  };

  if (loading || authLoading) return <LoadingScreen />;
  if (!libro) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-8 py-16">
        <div className="mb-10">
          <h1 className="text-6xl font-bold mb-2">{libro.titulo}</h1>
          <p className="text-2xl text-gray-800">Detalles del libro</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-800">
                <User className="w-5 h-5" />
                <span className="text-lg">
                  {libro.autor ? `${libro.autor.nombre} ${libro.autor.apellido}` : `Autor ID ${libro.autorId}`}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-800">
                <Calendar className="w-5 h-5" />
                <span className="text-lg">{libro.anio}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-800">
                <BookOpen className="w-5 h-5" />
                <span className="text-lg">ISBN: {libro.isbn}</span>
              </div>
            </div>

            {isLector && (
              <div className="mt-8">
                <Button onClick={solicitarPrestamo} disabled={creating} size="lg">
                  {creating ? 'Solicitando…' : 'Solicitar préstamo'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


