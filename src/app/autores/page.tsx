'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { LoadingScreen } from '@/components/ui/Spinner';
import { Search, Plus, User, Globe, Calendar } from 'lucide-react';
import { autoresService } from '@/lib/services/autores.service';
import { Autor } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function AutoresPage() {
  const [autores, setAutores] = useState<Autor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAutor, setSelectedAutor] = useState<Autor | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    nacionalidad: '',
    fechaNacimiento: '',
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
      } else {
        await autoresService.create(formData as Omit<Autor, 'id'>);
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving autor:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este autor?')) {
      try {
        await autoresService.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting autor:', error);
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
              <Card key={autor.id} hover>
                <CardHeader>
                  <CardTitle>{autor.nombre} {autor.apellido}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-gray-800">
                      <Globe className="w-5 h-5" />
                      <span className="text-lg">{autor.nacionalidad}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-800">
                      <Calendar className="w-5 h-5" />
                      <span className="text-lg">{new Date(autor.fechaNacimiento).toLocaleDateString()}</span>
                    </div>

                    {isAdmin && (
                      <div className="flex space-x-4 mt-6 pt-6 border-t-2 border-gray-200">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openEditModal(autor)}
                          className="flex-1"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(autor.id)}
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
    </div>
  );
}


