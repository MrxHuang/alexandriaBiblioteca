'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { LoadingScreen } from '@/components/ui/Spinner';
import { BookMarked, User, BookOpen, CalendarCheck2 } from 'lucide-react';
import { prestamosService } from '@/lib/services/prestamos.service';
import { librosService } from '@/lib/services/libros.service';
import { usuariosService } from '@/lib/services/usuarios.service';
import { Libro, Prestamo, Usuario } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [libros, setLibros] = useState<Libro[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ libroId: 0, usuarioId: 0 });
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prestamosResp, librosResp, usuariosResp] = await Promise.all([
        prestamosService.getAll({ size: 100 }),
        librosService.getAllNoPagination(),
        usuariosService.getAllNoPagination(),
      ]);
      setPrestamos(prestamosResp.content);
      setLibros(librosResp);
      setUsuarios(usuariosResp);
    } catch (error) {
      console.error('Error fetching prestamos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await prestamosService.create({ libroId: formData.libroId, usuarioId: formData.usuarioId });
      setIsModalOpen(false);
      setFormData({ libroId: 0, usuarioId: 0 });
      fetchData();
    } catch (error) {
      console.error('Error creating prestamo:', error);
    }
  };

  const handleDevolver = async (id: number) => {
    try {
      await prestamosService.devolverLibro(id);
      fetchData();
    } catch (error) {
      console.error('Error devolviendo libro:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar préstamo?')) {
      try {
        await prestamosService.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error eliminando préstamo:', error);
      }
    }
  };

  if (loading || authLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-8 py-16">
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-6xl font-bold mb-4">Préstamos</h1>
              <p className="text-2xl text-gray-800">{prestamos.length} registros</p>
            </div>
            {isAdmin && (
              <Button
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-3"
              >
                <BookMarked className="w-6 h-6" />
                <span>Nuevo Préstamo</span>
              </Button>
            )}
          </div>
        </div>

        {prestamos.length === 0 ? (
          <div className="text-center py-24">
            <BookMarked className="w-24 h-24 mx-auto mb-6 text-gray-500" strokeWidth={1.5} />
            <p className="text-2xl text-gray-700">No hay préstamos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prestamos.map((p) => (
              <Card key={p.id}>
                <CardHeader>
                  <CardTitle>Préstamo #{p.id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-gray-800">
                      <BookOpen className="w-5 h-5" />
                      <span className="text-lg">{p.libro?.titulo ?? `Libro ID ${p.libroId}`}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-800">
                      <User className="w-5 h-5" />
                      <span className="text-lg">{p.usuario?.nombre ?? `Usuario ID ${p.usuarioId}`}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-800">
                      <CalendarCheck2 className="w-5 h-5" />
                      <span className="text-lg">
                        {new Date(p.fechaPrestamo).toLocaleDateString()} {p.devuelto ? `· Devuelto: ${p.fechaDevolucion ? new Date(p.fechaDevolucion).toLocaleDateString() : ''}` : '· Activo'}
                      </span>
                    </div>

                    {isAdmin && (
                      <div className="flex space-x-4 mt-6 pt-6 border-t-2 border-gray-200">
                        {!p.devuelto && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDevolver(p.id)}
                            className="flex-1"
                          >
                            Marcar como devuelto
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(p.id)}
                          className="flex-1"
                        >
                          Eliminar
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Préstamo"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="block text-lg font-medium text-gray-900">Libro</label>
            <select
              value={formData.libroId}
              onChange={(e) => setFormData({ ...formData, libroId: parseInt(e.target.value) })}
              className="w-full px-6 py-4 text-lg bg-white border-2 border-gray-300 focus:border-black focus:outline-none transition-colors"
              required
            >
              <option value={0}>Selecciona un libro</option>
              {libros.map((l) => (
                <option key={l.id} value={l.id}>{l.titulo}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-lg font-medium text-gray-900">Usuario</label>
            <select
              value={formData.usuarioId}
              onChange={(e) => setFormData({ ...formData, usuarioId: parseInt(e.target.value) })}
              className="w-full px-6 py-4 text-lg bg-white border-2 border-gray-300 focus:border-black focus:outline-none transition-colors"
              required
            >
              <option value={0}>Selecciona un usuario</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>{u.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4 pt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">Crear</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


