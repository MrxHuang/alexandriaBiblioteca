import React from 'react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
        <p className="text-xl font-medium text-gray-700">Cargando...</p>
      </div>
    </div>
  );
}