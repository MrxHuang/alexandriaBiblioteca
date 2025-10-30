import { api } from './api';
import { PageResponse, Usuario } from '../types';

export const usuariosService = {
  getAll: async (params?: {
    page?: number;
    size?: number;
    search?: string;
    rol?: string;
  }): Promise<PageResponse<Usuario>> => {
    const response = await api.get<PageResponse<Usuario>>('/usuarios', { params });
    return response.data;
  },

  getAllNoPagination: async (): Promise<Usuario[]> => {
    const response = await api.get<Usuario[]>('/usuarios/all');
    return response.data;
  },

  getById: async (id: number): Promise<Usuario> => {
    const response = await api.get<Usuario>(`/usuarios/${id}`);
    return response.data;
  },
};

