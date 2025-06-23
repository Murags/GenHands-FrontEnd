import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiLoader } from 'react-icons/fi';

import { useCategories } from '../../hooks/useCategories';
import LoadingModal from '../../components/LoadingModal';
import Modal from '../../components/Modal';
import ConfirmationModal from '../../components/ConfirmationModal';

const DashboardCategoriesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const {
    categories,
    isLoading,
    isError,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCategories();

  const openModal = (category = null) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(false);
  };

  const openConfirmModal = (id) => {
    setCategoryToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setCategoryToDelete(null);
    setIsConfirmModalOpen(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
    };

    const mutationOptions = {
      onSuccess: () => closeModal(),
    };

    if (selectedCategory) {
      updateCategory({ id: selectedCategory._id, data }, mutationOptions);
    } else {
      createCategory(data, mutationOptions);
    }
  };

  const handleDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete, {
        onSuccess: () => closeConfirmModal(),
      });
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-ghibli-cream min-h-screen">
      <LoadingModal isVisible={isLoading} message="Fetching categories..." />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-ghibli-dark-blue handwritten mb-2">Category Management</h1>
          <p className="text-ghibli-brown">Organize donation items into meaningful categories</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center bg-ghibli-teal text-white px-6 py-3 rounded-lg shadow-ghibli hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105"
        >
          <FiPlus className="mr-2" /> Add New Category
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-ghibli border border-ghibli-brown-light mb-8">
        <div className="relative">
          <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-ghibli-brown" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-ghibli-brown-light rounded-lg focus:outline-none focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
          />
        </div>
      </div>

      {isError && (
        <div className="bg-ghibli-red-light border border-ghibli-red text-ghibli-dark-blue p-4 rounded-lg mb-6">
          <p className="font-medium">Error fetching categories. Please try again later.</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light overflow-hidden">
        <div className="bg-ghibli-cream-lightest px-6 py-4 border-b border-ghibli-brown-light">
          <h3 className="text-lg font-semibold text-ghibli-dark-blue">All Categories ({filteredCategories.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-ghibli-brown-light">
            <thead className="bg-ghibli-cream-lightest">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-ghibli-dark-blue uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-ghibli-dark-blue uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-ghibli-dark-blue uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ghibli-brown-light">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-ghibli-brown">
                    <div className="flex flex-col items-center">
                      <p className="text-lg font-medium mb-2">No categories found</p>
                      <p className="text-sm">
                        {searchTerm ? 'Try adjusting your search terms' : 'Create your first category to get started'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map(category => (
                  <tr key={category._id} className="hover:bg-ghibli-cream-lightest transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-ghibli-dark-blue">{category.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-ghibli-brown max-w-md">
                        {category.description || <span className="italic text-ghibli-brown-light">No description</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openModal(category)}
                        className="text-ghibli-teal hover:text-ghibli-dark-blue mr-4 transition-all duration-200 transform hover:scale-110"
                        title="Edit category"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => openConfirmModal(category._id)}
                        className="text-ghibli-red hover:text-ghibli-dark-blue transition-all duration-200 transform hover:scale-110"
                        title="Delete category"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedCategory ? 'Edit Category' : 'Add New Category'}
        subtitle={selectedCategory ? 'Update the category details below' : 'Create a new category for organizing donations'}
        size="medium"
      >
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-ghibli-dark-blue mb-2">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={selectedCategory?.name}
              required
              className="w-full px-4 py-3 border border-ghibli-brown-light rounded-lg focus:outline-none focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
              placeholder="e.g., Food items, Clothing, Books"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-ghibli-dark-blue mb-2">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              defaultValue={selectedCategory?.description}
              rows="4"
              className="w-full px-4 py-3 border border-ghibli-brown-light rounded-lg focus:outline-none focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
              placeholder="Describe what types of items belong in this category..."
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-3 border border-ghibli-brown-light rounded-lg text-ghibli-brown hover:bg-ghibli-cream-lightest transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-6 py-3 bg-ghibli-teal text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center disabled:opacity-50"
            >
              {(isCreating || isUpdating) && <FiLoader className="animate-spin mr-2" />}
              {selectedCategory ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleDelete}
        title="Delete Category?"
        message="Are you sure you want to delete this category? This action cannot be undone and may affect existing donations."
        confirmText="Delete Category"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DashboardCategoriesPage;
