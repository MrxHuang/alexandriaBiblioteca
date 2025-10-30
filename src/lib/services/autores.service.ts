import { api } from './api';
import { Autor, PageResponse } from '../types';

export const autoresService = {
  getAll: async (params?: {
    page?: number;
    size?: number;
    search?: string;
  }): Promise<PageResponse<Autor>> => {
    const response = await api.get<PageResponse<Autor>>('/autores', { params });
    return response.data;
  },

  getAllNoPagination: async (): Promise<Autor[]> => {
    const response = await api.get<Autor[]>('/autores/all');
    return response.data;
  },

  getById: async (id: number): Promise<Autor> => {
    const response = await api.get<Autor>(`/autores/${id}`);
    return response.data;
  },

  create: async (autor: Omit<Autor, 'id'>): Promise<Autor> => {
    const response = await api.post<Autor>('/autores', autor);
    return response.data;
  },

  update: async (id: number, autor: Partial<Autor>): Promise<Autor> => {
    const response = await api.put<Autor>(`/autores/${id}`, autor);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/autores/${id}`);
  },
};