'use client';

import React from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import CardNav from '../ui/CardNav';
import { BookOpen } from 'lucide-react';

export function Header() {
  const { user, logout, isAuthenticated, isAdmin, isLector } = useAuth();

  // Si no está autenticado, no mostrar navegación
  if (!isAuthenticated) {
    return null;
  }

  // Opciones para ADMIN
  const adminItems = [
    {
      label: 'Catálogo',
      bgColor: '#0D0716',
      textColor: '#fff',
      links: [
        { label: 'Libros', href: '/libros', ariaLabel: 'Ver catálogo de libros' },
        { label: 'Autores', href: '/autores', ariaLabel: 'Ver lista de autores' },
      ],
    },
    {
      label: 'Préstamos',
      bgColor: '#170D27',
      textColor: '#fff',
      links: [
        { label: 'Todos los préstamos', href: '/prestamos', ariaLabel: 'Ver préstamos' },
      ],
    },
    {
      label: 'Sistema',
      bgColor: '#271E37',
      textColor: '#fff',
      links: [
        { label: 'Dashboard', href: '/dashboard', ariaLabel: 'Ir al dashboard' },
      ],
    },
  ];

  // Opciones para LECTOR
  const lectorItems = [
    {
      label: 'Catálogo',
      bgColor: '#0D0716',
      textColor: '#fff',
      links: [
        { label: 'Libros', href: '/libros', ariaLabel: 'Ver catálogo de libros' },
        { label: 'Autores', href: '/autores', ariaLabel: 'Ver lista de autores' },
      ],
    },
    {
      label: 'Mis Préstamos',
      bgColor: '#170D27',
      textColor: '#fff',
      links: [
        { label: 'Ver préstamos', href: '/prestamos', ariaLabel: 'Ver mis préstamos' },
        { label: 'Solicitar préstamo', href: '/libros', ariaLabel: 'Solicitar un préstamo' },
      ],
    },
    {
      label: 'Cuenta',
      bgColor: '#271E37',
      textColor: '#fff',
      links: [
        { label: 'Dashboard', href: '/dashboard', ariaLabel: 'Ir al dashboard' },
        { label: 'Mi perfil', href: '/perfil', ariaLabel: 'Ver mi perfil' },
      ],
    },
  ];

  const items = isAdmin ? adminItems : lectorItems;

  const logo = (
    <div className="flex items-center space-x-2">
      <BookOpen className="w-7 h-7 text-gray-900" strokeWidth={1.5} />
      <span className="text-xl font-bold text-gray-900 tracking-tight">ALEXANDRIA</span>
    </div>
  );

  return (
    <header className="relative min-h-[100px] bg-transparent">
      <CardNav
        logo={logo}
        logoAlt="Alexandria Logo"
        items={items}
        baseColor="#fff"
        menuColor="#000"
        buttonBgColor="#111"
        buttonTextColor="#fff"
        ease="power3.out"
        onLogout={logout}
        userName={user?.nombre}
        userRole={isAdmin ? 'Admin' : 'Lector'}
      />
    </header>
  );
}