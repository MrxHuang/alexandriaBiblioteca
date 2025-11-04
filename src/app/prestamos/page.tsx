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
import { useToast } from '@/lib/hooks/useToast';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [libros, setLibros] = useState<Libro[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ libroId: 0, usuarioId: 0 });
  const { isAuthenticated, isAdmin, isLector, loading: authLoading, user } = useAuth();
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && (isAdmin || (isLector && user))) {
      fetchData();
    }
  }, [isAdmin, isLector, user, isAuthenticated, authLoading]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prestamosResp, librosResp, usuariosResp] = await Promise.all([
        // LECTOR: solo sus préstamos; ADMIN: todos
        isLector && user
          ? prestamosService.getAll({ size: 100, usuarioId: user.id })
          : prestamosService.getAll({ size: 100 }),
        librosService.getAllNoPagination(),
        // Sólo ADMIN puede consumir /usuarios/all (evita 403)
        isAdmin ? usuariosService.getAllNoPagination() : Promise.resolve([] as Usuario[]),
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
      const usuarioId = isAdmin ? formData.usuarioId : (user?.id ?? 0);
      await prestamosService.create({ libroId: formData.libroId, usuarioId });
      setIsModalOpen(false);
      setFormData({ libroId: 0, usuarioId: 0 });
      showSuccess('Préstamo creado con éxito');
      fetchData();
    } catch (error: any) {
      console.error('Error creating prestamo:', error);
      const message = error?.response?.data?.message || 'Error al crear el préstamo';
      showError(message);
    }
  };

  const handleDevolver = async (id: number) => {
    try {
      await prestamosService.devolverLibro(id);
      showSuccess('Libro marcado como devuelto');
      fetchData();
    } catch (error: any) {
      console.error('Error devolviendo libro:', error);
      const message = error?.response?.data?.message || 'Error al devolver el libro';
      showError(message);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este préstamo?')) {
      try {
        await prestamosService.delete(id);
        showSuccess('Préstamo eliminado con éxito');
        fetchData();
      } catch (error: any) {
        console.error('Error eliminando préstamo:', error);
        const message = error?.response?.data?.message || 'Error al eliminar el préstamo';
        showError(message);
      }
    }
  };

  if (loading || authLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-8 pt-20 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-6xl font-bold mb-4">Préstamos</h1>
              <p className="text-2xl text-gray-800">{prestamos.length} registros</p>
            </div>
            {isAdmin && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-3"
                >
                  <BookMarked className="w-6 h-6" />
                  <span>Nuevo Préstamo</span>
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {prestamos.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-24"
          >
            <BookMarked className="w-24 h-24 mx-auto mb-6 text-gray-500" strokeWidth={1.5} />
            <p className="text-2xl text-gray-700">No hay préstamos</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prestamos.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="bg-gradient-to-br from-white to-gray-50/50 h-full flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold">Préstamo #{p.id}</CardTitle>
                    {p.devuelto ? (
                      <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                        Devuelto
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                        Activo
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center space-x-3 text-gray-700">
                      <div className="flex-shrink-0 w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-base font-medium">{p.libro?.titulo ?? `Libro ID ${p.libroId}`}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <div className="flex-shrink-0 w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-base font-medium">{p.usuario?.nombre ?? `Usuario ID ${p.usuarioId}`}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <div className="flex-shrink-0 w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                        <CalendarCheck2 className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-base">
                        {new Date(p.fechaPrestamo).toLocaleDateString()} {p.devuelto && p.fechaDevolucion && `· Devuelto: ${new Date(p.fechaDevolucion).toLocaleDateString()}`}
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
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isAdmin ? "Crear Préstamo" : "Solicitar Préstamo"}
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

          {isAdmin && (
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
          )}

          <div className="flex space-x-4 pt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">{isAdmin ? 'Crear' : 'Solicitar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


