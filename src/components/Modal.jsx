import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({
  isOpen = false,
  onClose,
  title,
  subtitle,
  children,
  size = 'medium', // 'small', 'medium', 'large', 'xl'
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = '',
}) => {
  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdropClick && onClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className={`
          relative bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light
          w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto
          transform transition-all duration-300 ease-in-out scale-100
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex-1">
              {title && (
                <h2 className="text-2xl font-bold text-ghibli-dark-blue handwritten mb-2">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-ghibli-brown text-sm">
                  {subtitle}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-4 text-ghibli-brown hover:text-ghibli-dark-blue transition-colors p-1 rounded-lg hover:bg-ghibli-cream-lightest"
                aria-label="Close modal"
              >
                <FiX size={24} />
              </button>
            )}
          </div>
        )}

        <div className={title || showCloseButton ? 'px-6 pb-6' : 'p-6'}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
