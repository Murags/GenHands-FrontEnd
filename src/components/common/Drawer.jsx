import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Drawer = ({ isOpen, onClose, title, children, position = 'right' }) => {
  console.log('Drawer component rendering/re-rendering. Received isOpen:', isOpen); // Log the isOpen prop
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent background scroll when drawer is open
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Base classes that define the drawer's initial off-screen position and fixed nature
  const basePositionClasses = position === 'right' ? 'inset-y-0 right-0' : 'inset-y-0 left-0';

  const transitionClasses = 'transition-transform duration-300 ease-in-out';

  if (!isOpen && position === 'right') {
  }

  return (
    <>
      {/* Backdrop - TEMPORARILY COMMENTED OUT FOR TESTING */}
      {/*
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ease-in-out ${isOpen ? 'bg-opacity-60' : 'bg-opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      */}
      <div
        className={`fixed ${basePositionClasses} z-50 flex h-full w-full max-w-md flex-col overflow-y-auto bg-ghibli-cream-lightest shadow-xl ${transitionClasses}`}
        style={{
          color: 'var(--color-ghibli-brown)',
          transform: isOpen ? 'translateX(0)' : (position === 'right' ? 'translateX(100%)' : 'translateX(-100%)'),
          visibility: isOpen ? 'visible' : 'hidden',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-ghibli-brown-light bg-ghibli-cream-light">
          <h2 className="text-xl font-semibold text-ghibli-dark-blue font-sans">
            {title || 'Details'}
          </h2>
          <button
            type="button"
            className="cursor-pointer rounded-md p-1 text-ghibli-brown hover:text-ghibli-red-dark hover:bg-ghibli-red-light transition-colors"
            onClick={onClose}
          >
            <span className="sr-only">Close panel</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;
