import {
  signInWithPopup,
  GoogleAuthProvider,
  User,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { api } from './api';
import { storage } from '../utils/storage';
import { AuthResponse, Usuario, UserRole } from '../types';

const googleProvider = new GoogleAuthProvider();

// Configure providers
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const firebaseAuthService = {
  /**
   * Inicia sesión con Google
   */
  signInWithGoogle: async (role: UserRole = UserRole.LECTOR): Promise<AuthResponse> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Enviar token a backend para crear/obtener usuario
      const response = await api.post<AuthResponse>('/auth/firebase', {
        idToken,
        provider: 'google',
        email: user.email,
        name: user.displayName,
        photoUrl: user.photoURL,
        role: role,
      });

      const { token, usuario } = response.data;
      storage.setToken(token);
      storage.setUser(usuario);

      return response.data;
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  },

  /**
   * Cierra sesión de Firebase
   */
  signOut: async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      storage.clear();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  /**
   * Obtiene el usuario actual de Firebase
   */
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },
};

