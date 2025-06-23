import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const firstItemIndex = (currentPage - 1) * itemsPerPage + 1;
  const lastItemIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between border-t border-ghibli-brown-light bg-ghibli-cream px-4 py-3 sm:px-6 mt-6 rounded-b-lg">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-ghibli-brown-light bg-ghibli-cream-light px-4 py-2 text-sm font-medium text-ghibli-brown hover:bg-ghibli-cream-lightest disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-ghibli-brown-light bg-ghibli-cream-light px-4 py-2 text-sm font-medium text-ghibli-brown hover:bg-ghibli-cream-lightest disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          {itemsPerPage && totalItems ? (
            <p className="text-sm text-ghibli-brown">
              Showing <span className="font-medium">{firstItemIndex}</span> to <span className="font-medium">{lastItemIndex}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
            </p>
          ) : (
            <p className="text-sm text-ghibli-brown">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </p>
          )}
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-ghibli-brown ring-1 ring-inset ring-ghibli-brown-light hover:bg-ghibli-cream-lightest focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                aria-current={pageNumber === currentPage ? 'page' : undefined}
                className={classNames(
                  'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0',
                  pageNumber === currentPage
                    ? 'z-10 bg-ghibli-teal text-ghibli-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ghibli-teal-dark'
                    : 'text-ghibli-brown ring-1 ring-inset ring-ghibli-brown-light hover:bg-ghibli-cream-lightest'
                )}
              >
                {pageNumber}
              </button>
            ))}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-ghibli-brown ring-1 ring-inset ring-ghibli-brown-light hover:bg-ghibli-cream-lightest focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
