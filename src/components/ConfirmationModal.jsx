import React from 'react';
import { FiAlertTriangle, FiLoader } from 'react-icons/fi';
import Modal from './Modal';

const ConfirmationModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-ghibli-red hover:bg-opacity-90',
  isLoading = false,
  icon = <FiAlertTriangle className="text-ghibli-red h-8 w-8" />,
  iconBgClass = 'bg-ghibli-red-light',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="small"
      showCloseButton={false}
      className="text-center"
    >
      <div className={`mx-auto w-16 h-16 ${iconBgClass} rounded-full flex items-center justify-center mb-4`}>
        {icon}
      </div>

      <h2 className="text-xl font-bold text-ghibli-dark-blue font-sans mb-2">
        {title}
      </h2>

      <p className="text-ghibli-brown mb-6">
        {message}
      </p>

      <div className="flex justify-center space-x-4">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="cursor-pointer px-6 py-3 border border-ghibli-brown-light rounded-lg text-ghibli-brown hover:bg-ghibli-cream-lightest transition-colors disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`cursor-pointer px-6 py-3 text-white rounded-lg transition-colors flex items-center disabled:opacity-50 ${confirmButtonClass}`}
        >
          {isLoading && <FiLoader className="animate-spin mr-2" />}
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
