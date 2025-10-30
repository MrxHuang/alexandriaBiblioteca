import { api } from './api';
import { Libro, PageResponse } from '../types';

export const librosService = {
  getAll: async (params?: {
    page?: number;
    size?: number;
    search?: string;
    titulo?: string;
    autor?: string;
    isbn?: string;
  }): Promise<PageResponse<Libro>> => {
    const response = await api.get<PageResponse<Libro>>('/libros', { params });
    return response.data;
  },

  getAllNoPagination: async (): Promise<Libro[]> => {
    const response = await api.get<Libro[]>('/libros/all');
    return response.data;
  },

  getById: async (id: number): Promise<Libro> => {
    const response = await api.get<Libro>(`/libros/${id}`);
    return response.data;
  },

  getByAutor: async (autorId: number): Promise<Libro[]> => {
    const response = await api.get<Libro[]>(`/libros/autor/${autorId}`);
    return response.data;
  },

  create: async (libro: Omit<Libro, 'id'>): Promise<Libro> => {
    const response = await api.post<Libro>('/libros', libro);
    return response.data;
  },

  update: async (id: number, libro: Partial<Libro>): Promise<Libro> => {
    const response = await api.put<Libro>(`/libros/${id}`, libro);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/libros/${id}`);
  },
};