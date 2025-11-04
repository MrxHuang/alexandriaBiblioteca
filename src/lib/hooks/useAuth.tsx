'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, LoginCredentials, Usuario, UserRole } from '../types';
import { authService } from '../services/auth.service';
import { firebaseAuthService } from '../services/firebaseAuth.service';
import { useRouter } from 'next/navigation';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setToken(authService.isAuthenticated() ? 'valid' : null);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.usuario);
      setToken(response.token);
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async (role: UserRole = UserRole.LECTOR) => {
    try {
      const response = await firebaseAuthService.signInWithGoogle(role);
      setUser(response.usuario);
      setToken(response.token);
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseAuthService.signOut();
    } catch (error) {
      console.error('Error signing out from Firebase:', error);
    }
    authService.logout();
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    loginWithGoogle,
    logout,
    isAuthenticated: !!token,
    isAdmin: user?.rol === UserRole.ADMIN,
    isLector: user?.rol === UserRole.LECTOR,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}