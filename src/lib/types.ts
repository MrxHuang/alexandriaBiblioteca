// Entity Types
export interface Autor {
  id: number;
  nombre: string;
  apellido: string;
  nacionalidad: string;
  fechaNacimiento: string;
}

export interface Libro {
  id: number;
  titulo: string;
  isbn: string;
  anio: number;
  autorId: number;
  autor?: Autor;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  LECTOR = 'LECTOR'
}

export enum UserStatus {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO'
}

export interface Usuario {
  id: number;
  nombre: string;
  username: string;
  email: string;
  rol: UserRole;
  estado: UserStatus;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface Prestamo {
  id: number;
  libroId: number;
  usuarioId: number;
  fechaPrestamo: string;
  fechaDevolucion: string | null;
  devuelto: boolean;
  libro?: Libro;
  usuario?: Usuario;
}

// Authentication Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  username: string;
  email: string;
  password: string;
  rol: UserRole;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: (role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLector: boolean;
  loading: boolean;
}

// Pagination Types
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// API Error Response
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string>;
}