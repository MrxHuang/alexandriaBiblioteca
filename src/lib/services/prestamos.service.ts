import { api } from './api';
import { Prestamo, PageResponse } from '../types';

export const prestamosService = {
  getAll: async (params?: {
    page?: number;
    size?: number;
    usuarioId?: number;
    libroId?: number;
    devuelto?: boolean;
  }): Promise<PageResponse<Prestamo>> => {
    const response = await api.get<PageResponse<Prestamo>>('/prestamos', { params });
    return response.data;
  },

  getAllNoPagination: async (): Promise<Prestamo[]> => {
    const response = await api.get<Prestamo[]>('/prestamos/all');
    return response.data;
  },

  getById: async (id: number): Promise<Prestamo> => {
    const response = await api.get<Prestamo>(`/prestamos/${id}`);
    return response.data;
  },

  create: async (prestamo: { libroId: number; usuarioId: number }): Promise<Prestamo> => {
    const response = await api.post<Prestamo>('/prestamos', prestamo);
    return response.data;
  },

  devolverLibro: async (id: number): Promise<Prestamo> => {
    const response = await api.patch<Prestamo>(`/prestamos/${id}/devolver`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/prestamos/${id}`);
  },
};