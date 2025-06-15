import React from 'react';
import loaderGif from '../assets/loader_gif.gif';
import Modal from './Modal';

const LoadingModal = ({
  isVisible = false,
  message = "Loading...",
  showMessage = true,
  size = "medium"
}) => {
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24",
    large: "w-32 h-32"
  };

  return (
    <Modal
      isOpen={isVisible}
      showCloseButton={false}
      closeOnBackdropClick={false}
      size="small"
    >
      <div className="flex flex-col items-center space-y-4 py-4">
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-ghibli-teal shadow-lg`}>
          <img
            src={loaderGif}
            alt="Loading..."
            className="w-full h-full object-cover"
          />
        </div>

        {showMessage && (
          <div className="text-center">
            <p className="text-ghibli-dark-blue font-medium text-lg">{message}</p>
            <div className="flex justify-center space-x-1 mt-2">
              <div className="w-2 h-2 bg-ghibli-teal rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-ghibli-teal rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-ghibli-teal rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LoadingModal;
