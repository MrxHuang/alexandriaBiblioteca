import { api } from './api';
import { AuthResponse, LoginCredentials, Usuario } from '../types';
import { storage } from '../utils/storage';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { token, usuario } = response.data;
    storage.setToken(token);
    storage.setUser(usuario);
    return response.data;
  },

  register: async (userData: Partial<Usuario> & { password: string }): Promise<Usuario> => {
    const response = await api.post<Usuario>('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    storage.clear();
  },

  getCurrentUser: (): Usuario | null => {
    return storage.getUser();
  },

  isAuthenticated: (): boolean => {
    return !!storage.getToken();
  },
};