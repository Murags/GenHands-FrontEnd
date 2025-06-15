import React from 'react';
import loaderGif from '../assets/loader_gif.gif';

const LoadingModal = ({
  isVisible = false,
  message = "Loading...",
  showMessage = true,
  size = "medium"
}) => {
  if (!isVisible) return null;

  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24",
    large: "w-32 h-32"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4 max-w-sm mx-4">
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
    </div>
  );
};

export default LoadingModal;
