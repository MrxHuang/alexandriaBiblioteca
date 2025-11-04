'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { LoadingScreen } from '@/components/ui/Spinner';
import { Search, Plus, User, Globe, Calendar, BookOpen, X } from 'lucide-react';
import { autoresService } from '@/lib/services/autores.service';
import { librosService } from '@/lib/services/libros.service';
import { Autor, Libro } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AutoresPage() {
  const [autores, setAutores] = useState<Autor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAutor, setSelectedAutor] = useState<Autor | null>(null);
  const [selectedAutorLibros, setSelectedAutorLibros] = useState<Libro[]>([]);
  const [showLibrosModal, setShowLibrosModal] = useState(false);
  const [loadingLibros, setLoadingLibros] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    nacionalidad: '',
    fechaNacimiento: '',
  });

  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const autoresData = await (searchTerm
        ? autoresService.getAll({ search: searchTerm, size: 50 })
        : autoresService.getAll({ size: 50 }));
      setAutores(autoresData.content);
    } catch (error) {
      console.error('Error fetching autores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedAutor) {
        await autoresService.update(selectedAutor.id, formData);
        showSuccess('Autor actualizado con éxito');
      } else {
        await autoresService.create(formData as Omit<Autor, 'id'>);
        showSuccess('Autor creado con éxito');
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error('Error saving autor:', error);
      const message = error?.response?.data?.message || 'Error al guardar el autor';
      showError(message);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este autor?')) {
      try {
        await autoresService.delete(id);
        showSuccess('Autor eliminado con éxito');
        fetchData();
      } catch (error: any) {
        console.error('Error deleting autor:', error);
        const message = error?.response?.data?.message || 'Error al eliminar el autor';
        showError(message);
      }
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', apellido: '', nacionalidad: '', fechaNacimiento: '' });
    setSelectedAutor(null);
  };

  const openEditModal = (autor: Autor) => {
    setSelectedAutor(autor);
    setFormData({
      nombre: autor.nombre,
      apellido: autor.apellido,
      nacionalidad: autor.nacionalidad,
      fechaNacimiento: autor.fechaNacimiento,
    });
    setIsModalOpen(true);
  };

  const handleAutorClick = async (autor: Autor) => {
    if (isAdmin) {
      // Si es admin, abre el modal de edición
      openEditModal(autor);
    } else {
      // Si es lector, muestra los libros del autor
      setSelectedAutor(autor);
      setShowLibrosModal(true);
      setLoadingLibros(true);
      try {
        const libros = await librosService.getByAutor(autor.id);
        setSelectedAutorLibros(libros);
      } catch (error) {
        console.error('Error fetching libros:', error);
      } finally {
        setLoadingLibros(false);
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
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-6xl font-bold mb-4">Autores</h1>
              <p className="text-2xl text-gray-800">{autores.length} autores registrados</p>
            </div>
            {isAdmin && (
              <Button
                size="lg"
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="flex items-center space-x-3"
              >
                <Plus className="w-6 h-6" />
                <span>Agregar Autor</span>
              </Button>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-600" />
            <input
              type="text"
              placeholder="Buscar por nombre o nacionalidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-6 text-xl bg-white border-2 border-gray-300 focus:border-black focus:outline-none transition-colors placeholder:text-gray-600"
            />
          </div>
        </div>

        {autores.length === 0 ? (
          <div className="text-center py-24">
            <User className="w-24 h-24 mx-auto mb-6 text-gray-500" strokeWidth={1.5} />
            <p className="text-2xl text-gray-700">No se encontraron autores</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {autores.map((autor) => (
              <motion.div
                key={autor.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
              <Card 
                hover 
                className="bg-gradient-to-br from-white to-gray-50/50 h-full flex flex-col cursor-pointer"
                onClick={() => handleAutorClick(autor)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-2xl font-bold text-gray-900 leading-tight">
                      {autor.nombre} {autor.apellido}
                    </CardTitle>
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-300">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center space-x-3 text-gray-700">
                      <div className="flex-shrink-0 w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-base font-medium">{autor.nacionalidad}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <div className="flex-shrink-0 w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-base font-medium">{new Date(autor.fechaNacimiento).toLocaleDateString()}</span>
                    </div>

                    {!isAdmin && (
                      <div className="flex items-center space-x-2 mt-4 pt-4 border-t-2 border-gray-100 text-gray-600">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm font-medium">Ver libros disponibles</span>
                      </div>
                    )}

                    {isAdmin && (
                      <div className="flex space-x-3 mt-6 pt-6 border-t-2 border-gray-100">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(autor);
                          }}
                          className="flex-1"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(autor.id);
                          }}
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
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={selectedAutor ? 'Editar Autor' : 'Agregar Autor'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
          <Input
            label="Apellido"
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
            required
          />
          <Input
            label="Nacionalidad"
            value={formData.nacionalidad}
            onChange={(e) => setFormData({ ...formData, nacionalidad: e.target.value })}
            required
          />
          <Input
            label="Fecha de Nacimiento"
            type="date"
            value={formData.fechaNacimiento}
            onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
            required
          />

          <div className="flex space-x-4 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {selectedAutor ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal para mostrar libros del autor */}
      <Modal
        isOpen={showLibrosModal}
        onClose={() => {
          setShowLibrosModal(false);
          setSelectedAutor(null);
          setSelectedAutorLibros([]);
        }}
        title={`Libros de ${selectedAutor?.nombre} ${selectedAutor?.apellido}`}
        size="lg"
      >
        {loadingLibros ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Cargando libros...</div>
          </div>
        ) : selectedAutorLibros.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600">
              No hay libros disponibles de este autor
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedAutorLibros.map((libro) => (
              <motion.div
                key={libro.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white to-gray-50/50 border-2 border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer"
                onClick={() => {
                  setShowLibrosModal(false);
                  router.push(`/libros/${libro.id}`);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {libro.titulo}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>ISBN: {libro.isbn}</span>
                      </div>
                      {libro.anio && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Año: {libro.anio}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}


