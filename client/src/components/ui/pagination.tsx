import React from 'react';
import {Button} from './button';
import {ChevronLeft, ChevronRight, MoreHorizontal} from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  // Don't show pagination if there's only 1 page
  if (totalPages <= 1) return null;

  // Function to generate page numbers
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pageNumbers: (number | 'ellipsis')[] = [];

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust to show maxPagesToShow - 2 pages (minus first and last)
      if (end - start < maxPagesToShow - 3) {
        if (currentPage - 1 < totalPages - currentPage) {
          end = Math.min(totalPages - 1, start + maxPagesToShow - 3);
        } else {
          start = Math.max(2, end - maxPagesToShow + 3);
        }
      }

      // Add ellipsis before middle pages if necessary
      if (start > 2) {
        pageNumbers.push('ellipsis');
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis after middle pages if necessary
      if (end < totalPages - 1) {
        pageNumbers.push('ellipsis');
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous Page</span>
      </Button>
      
      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <Button key={`ellipsis-${index}`} variant="ghost" size="icon" className="h-8 w-8" disabled>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          );
        }
        
        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(page)}
            className={`h-8 w-8 ${currentPage === page ? 'bg-[#1e8449] hover:bg-[#166e3b]' : ''}`}
          >
            {page}
          </Button>
        );
      })}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next Page</span>
      </Button>
    </div>
  );
};
