'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { LoadingScreen } from '@/components/ui/Spinner';
import { Search, Plus, BookOpen, User, Calendar } from 'lucide-react';
import { librosService } from '@/lib/services/libros.service';
import { autoresService } from '@/lib/services/autores.service';
import { Libro, Autor } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LibrosPage() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [autores, setAutores] = useState<Autor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLibro, setSelectedLibro] = useState<Libro | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    isbn: '',
    anio: new Date().getFullYear(),
    autorId: 0,
  });
  
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
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
      const [librosData, autoresData] = await Promise.all([
        searchTerm
          ? librosService.getAll({ search: searchTerm, size: 50 })
          : librosService.getAll({ size: 50 }),
        autoresService.getAllNoPagination(),
      ]);
      setLibros(librosData.content);
      setAutores(autoresData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedLibro) {
        await librosService.update(selectedLibro.id, formData);
      } else {
        await librosService.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving libro:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este libro?')) {
      try {
        await librosService.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting libro:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      isbn: '',
      anio: new Date().getFullYear(),
      autorId: 0,
    });
    setSelectedLibro(null);
  };

  const openEditModal = (libro: Libro) => {
    setSelectedLibro(libro);
    setFormData({
      titulo: libro.titulo,
      isbn: libro.isbn,
      anio: libro.anio,
      autorId: libro.autorId,
    });
    setIsModalOpen(true);
  };

  if (loading || authLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-8 py-16">
        {/* Header Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-6xl font-bold mb-4">Catálogo de Libros</h1>
              <p className="text-2xl text-gray-800">
                {libros.length} {libros.length === 1 ? 'libro' : 'libros'} disponibles
              </p>
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
                <span>Agregar Libro</span>
              </Button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-600" />
            <input
              type="text"
              placeholder="Buscar por título, autor o ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-6 text-xl bg-white border-2 border-gray-300 focus:border-black focus:outline-none transition-colors placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* Books Grid */}
        {libros.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen className="w-24 h-24 mx-auto mb-6 text-gray-500" strokeWidth={1.5} />
            <p className="text-2xl text-gray-700">No se encontraron libros</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {libros.map((libro) => (
              <Card
                key={libro.id}
                hover
                className="cursor-pointer group"
                onClick={() => router.push(`/libros/${libro.id}`)}
              >
                <CardHeader>
                  <CardTitle className="line-clamp-2 group-hover:text-gray-800 transition-colors">
                    {libro.titulo}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-gray-800">
                      <User className="w-5 h-5" />
                      <span className="text-lg">
                        {libro.autor
                          ? `${libro.autor.nombre} ${libro.autor.apellido}`
                          : 'Autor desconocido'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-800">
                      <Calendar className="w-5 h-5" />
                      <span className="text-lg">{libro.anio}</span>
                    </div>
                    <div className="pt-4 border-t-2 border-gray-200">
                      <p className="text-base text-gray-700">ISBN: {libro.isbn}</p>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex space-x-4 mt-6 pt-6 border-t-2 border-gray-100">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(libro);
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
                          handleDelete(libro.id);
                        }}
                        className="flex-1"
                      >
                        Eliminar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Modal for Create/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={selectedLibro ? 'Editar Libro' : 'Agregar Libro'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Título"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            required
          />

          <Input
            label="ISBN"
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            required
          />

          <Input
            label="Año"
            type="number"
            value={formData.anio}
            onChange={(e) => setFormData({ ...formData, anio: parseInt(e.target.value) })}
            required
          />

          <div className="space-y-3">
            <label className="block text-lg font-medium text-black">Autor</label>
            <select
              value={formData.autorId}
              onChange={(e) => setFormData({ ...formData, autorId: parseInt(e.target.value) })}
              className="w-full px-6 py-4 text-lg bg-white border-2 border-gray-200 focus:border-black focus:outline-none transition-colors"
              required
            >
              <option value="0">Selecciona un autor</option>
              {autores.map((autor) => (
                <option key={autor.id} value={autor.id}>
                  {autor.nombre} {autor.apellido}
                </option>
              ))}
            </select>
          </div>

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
              {selectedLibro ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}