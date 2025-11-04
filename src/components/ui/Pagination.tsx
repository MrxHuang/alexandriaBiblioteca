import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  className,
}: PaginationProps) {
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Mostrar todas las páginas
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas con ellipsis
      if (currentPage < 3) {
        // Inicio: mostrar primeras páginas
        for (let i = 0; i < 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages - 1);
      } else if (currentPage > totalPages - 4) {
        // Final: mostrar últimas páginas
        pages.push(0);
        pages.push('...');
        for (let i = totalPages - 5; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Medio: mostrar páginas alrededor de la actual
        pages.push(0);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4 mt-12', className)}>
      {/* Info */}
      <div className="text-sm text-gray-600">
        Mostrando <span className="font-semibold text-gray-900">{startItem}</span> -{' '}
        <span className="font-semibold text-gray-900">{endItem}</span> de{' '}
        <span className="font-semibold text-gray-900">{totalElements}</span> libros
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 cursor-pointer',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            currentPage === 0
              ? 'border-gray-200 text-gray-400 bg-gray-50'
              : 'border-gray-300 text-gray-700 bg-white hover:border-gray-400 hover:bg-gray-50'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  'min-w-[40px] px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 cursor-pointer',
                  isActive
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-gray-400 hover:bg-gray-50'
                )}
              >
                {pageNum + 1}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 cursor-pointer',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            currentPage >= totalPages - 1
              ? 'border-gray-200 text-gray-400 bg-gray-50'
              : 'border-gray-300 text-gray-700 bg-white hover:border-gray-400 hover:bg-gray-50'
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
