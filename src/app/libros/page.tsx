'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { LoadingScreen } from '@/components/ui/Spinner';
import { SkeletonGrid, SkeletonSearchBar } from '@/components/ui/Skeleton';
import { Search, Plus, BookOpen, User, Calendar, Filter, X } from 'lucide-react';
import { librosService } from '@/lib/services/libros.service';
import { autoresService } from '@/lib/services/autores.service';
import { Libro, Autor } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Pagination } from '@/components/ui/Pagination';

export default function LibrosPage() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [autores, setAutores] = useState<Autor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Estado para el input (no dispara búsqueda)
  const [selectedAutorId, setSelectedAutorId] = useState<number | null>(null);
  const [selectedAnio, setSelectedAnio] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLibro, setSelectedLibro] = useState<Libro | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(12); // 12 libros por página
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    titulo: '',
    isbn: '',
    anio: new Date().getFullYear(),
    autorId: 0,
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
    if (isAuthenticated && !authLoading) {
      fetchData(currentPage);
      fetchAvailableYears();
    }
  }, [currentPage, searchTerm, selectedAutorId, selectedAnio, isAuthenticated, authLoading]);

  const fetchAvailableYears = async () => {
    try {
      const allLibros = await librosService.getAllNoPagination();
      const years = [...new Set(allLibros.map(l => l.anio).filter(Boolean))].sort((a, b) => b - a) as number[];
      setAvailableYears(years);
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(0);
  };

  const handleSearchClear = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(0);
  };

  const handleFilterClear = () => {
    setSelectedAutorId(null);
    setSelectedAnio(null);
    setCurrentPage(0);
  };

  const getFilteredTitle = () => {
    if (selectedAutorId && selectedAnio) {
      const autor = autores.find(a => a.id === selectedAutorId);
      return `Libros de ${autor?.nombre} ${autor?.apellido} del año ${selectedAnio}`;
    } else if (selectedAutorId) {
      const autor = autores.find(a => a.id === selectedAutorId);
      return `Libros de ${autor?.nombre} ${autor?.apellido} disponibles`;
    } else if (selectedAnio) {
      return `Libros del año ${selectedAnio} disponibles`;
    }
    return null;
  };

  const fetchData = async (page: number = currentPage) => {
    try {
      setLoading(true);
      
      // Construir parámetros de búsqueda
      const params: any = { page, size: pageSize };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      // Cargar autores si no están cargados
      if (autores.length === 0) {
        const autoresData = await autoresService.getAllNoPagination();
        setAutores(autoresData);
      }
      
      // Si hay filtro de autor, obtener libros por autor y luego filtrar
      let librosData;
      if (selectedAutorId) {
        const librosByAutor = await librosService.getByAutor(selectedAutorId);
        let filteredLibros = librosByAutor;
        
        // Aplicar búsqueda si existe
        if (searchTerm) {
          filteredLibros = filteredLibros.filter(libro => 
            libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            libro.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (libro.autor && `${libro.autor.nombre} ${libro.autor.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }
        
        // Aplicar filtro de año si existe
        if (selectedAnio) {
          filteredLibros = filteredLibros.filter(libro => libro.anio === selectedAnio);
        }
        
        // Paginar manualmente
        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedLibros = filteredLibros.slice(startIndex, endIndex);
        
        librosData = {
          content: paginatedLibros,
          totalElements: filteredLibros.length,
          totalPages: Math.ceil(filteredLibros.length / pageSize),
          page,
          size: pageSize,
          first: page === 0,
          last: endIndex >= filteredLibros.length,
        };
      } else {
        // Sin filtro de autor, usar la API normal
        const librosResponse = await librosService.getAll(params);
        
        // Filtrar por año si está seleccionado
        let filteredContent = librosResponse.content;
        if (selectedAnio) {
          filteredContent = filteredContent.filter(libro => libro.anio === selectedAnio);
          // Obtener total correcto cuando hay filtro de año
          const allLibros = await librosService.getAllNoPagination();
          const filteredAll = allLibros.filter(libro => libro.anio === selectedAnio);
          librosData = {
            ...librosResponse,
            content: filteredContent,
            totalElements: filteredAll.length,
            totalPages: Math.ceil(filteredAll.length / pageSize),
          };
        } else {
          librosData = librosResponse;
        }
      }
      
      setLibros(librosData.content);
      setTotalElements(librosData.totalElements);
      setTotalPages(librosData.totalPages);
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
        showSuccess('Libro actualizado con éxito');
      } else {
        await librosService.create(formData);
        showSuccess('Libro creado con éxito');
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error('Error saving libro:', error);
      const message = error?.response?.data?.message || 'Error al guardar el libro';
      showError(message);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este libro?')) {
      try {
        await librosService.delete(id);
        showSuccess('Libro eliminado con éxito');
        fetchData();
      } catch (error: any) {
        console.error('Error deleting libro:', error);
        const message = error?.response?.data?.message || 'Error al eliminar el libro';
        showError(message);
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

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen b-linear-to-br from-gray-50 via-white to-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-8 pt-20 pb-16">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-6xl font-bold mb-4">
                {getFilteredTitle() || 'Catálogo de Libros'}
              </h1>
              <p className="text-2xl text-gray-800">
                {totalElements} {totalElements === 1 ? 'libro' : 'libros'} {getFilteredTitle() ? 'encontrados' : 'disponibles'}
              </p>
            </div>
            {isAdmin && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
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
              </motion.div>
            )}
          </div>

          <div className="space-y-4">
            {/* Search Bar */}
            {loading ? (
              <SkeletonSearchBar />
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onSubmit={handleSearch}
                className="relative"
              >
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-600 pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Buscar por título, autor o ISBN..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-16 pr-24 py-6 text-xl bg-white border-2 border-gray-300 focus:border-gray-900 focus:outline-none transition-all duration-300 placeholder:text-gray-500 text-gray-900 font-medium hover:border-gray-400"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleSearchClear}
                    className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                    aria-label="Limpiar búsqueda"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Buscar
                </button>
              </motion.form>
            )}

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-4 flex-wrap"
            >
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
              >
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filtros</span>
              </button>
              
              {(selectedAutorId || selectedAnio) && (
                <button
                  onClick={handleFilterClear}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-sm font-medium text-gray-700"
                >
                  <X className="w-4 h-4" />
                  Limpiar filtros
                </button>
              )}

              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full bg-white border-2 border-gray-200 rounded-lg p-6 space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Filtro por Autor */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide">
                        Filtrar por Autor
                      </label>
                      <select
                        value={selectedAutorId || ''}
                        onChange={(e) => {
                          setSelectedAutorId(e.target.value ? parseInt(e.target.value) : null);
                          setCurrentPage(0);
                        }}
                        className="w-full px-4 py-3 text-base bg-white border-2 border-gray-200 focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:shadow-lg focus:shadow-gray-900/10 focus:ring-2 focus:ring-gray-900/10 cursor-pointer"
                      >
                        <option value="">Todos los autores</option>
                        {autores.map((autor) => (
                          <option key={autor.id} value={autor.id}>
                            {autor.nombre} {autor.apellido}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filtro por Año */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide">
                        Filtrar por Año
                      </label>
                      <select
                        value={selectedAnio || ''}
                        onChange={(e) => {
                          setSelectedAnio(e.target.value ? parseInt(e.target.value) : null);
                          setCurrentPage(0);
                        }}
                        className="w-full px-4 py-3 text-base bg-white border-2 border-gray-200 focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:shadow-lg focus:shadow-gray-900/10 focus:ring-2 focus:ring-gray-900/10 cursor-pointer"
                      >
                        <option value="">Todos los años</option>
                        {availableYears.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Books Grid */}
        {loading ? (
          <SkeletonGrid count={6} />
        ) : libros.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-24"
          >
            <BookOpen className="w-24 h-24 mx-auto mb-6 text-gray-500" strokeWidth={1.5} />
            <p className="text-2xl text-gray-700">No se encontraron libros</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {libros.map((libro, index) => (
              <motion.div
                key={libro.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                hover
                  className="cursor-pointer group h-full flex flex-col bg-gradient-to-br from-white to-gray-50/50"
                onClick={() => router.push(`/libros/${libro.id}`)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="line-clamp-2 group-hover:text-gray-900 transition-colors text-2xl font-bold text-gray-900 leading-tight">
                    {libro.titulo}
                  </CardTitle>
                    <div className="shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-300">
                      <BookOpen className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center space-x-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                      <div className="shrink-0 w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-base font-medium leading-relaxed">
                        {libro.autor
                          ? `${libro.autor.nombre} ${libro.autor.apellido}`
                          : 'Autor desconocido'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                      <div className="shrink-0 w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <Calendar className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-base font-medium">{libro.anio}</span>
                    </div>
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 font-mono">ISBN: {libro.isbn}</p>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex space-x-3 mt-6 pt-6 border-t-2 border-gray-100">
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
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {libros.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
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
              className="w-full px-6 py-4 text-lg bg-white border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 hover:border-gray-300 focus:shadow-lg focus:shadow-gray-900/10 focus:ring-2 focus:ring-gray-900/10 cursor-pointer"
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