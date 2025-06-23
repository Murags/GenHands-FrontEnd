import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  HeartIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';
import { useCharityNeeds } from '../../../hooks/useCharityNeeds';
import { useCategories } from '../../../hooks/useCategories';
import ConfirmationModal from '../../../components/ConfirmationModal';

const NeedsManager = () => {
  const {
    charityNeeds,
    isLoadingNeeds,
    isErrorNeeds,
    setNeeds,
    isSettingNeeds,
    clearNeeds,
    isClearingNeeds,
    refetchNeeds,
  } = useCharityNeeds();

  const { categories, isLoading: isLoadingCategories } = useCategories();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    neededCategories: [],
    needsStatement: '',
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Initialize form data when charityNeeds loads
  useEffect(() => {
    if (charityNeeds) {
      const categoryIds = charityNeeds.neededCategories?.map(cat => cat._id) || [];
      setFormData({
        neededCategories: categoryIds,
        needsStatement: charityNeeds.needsStatement || '',
      });
    } else {
      setFormData({
        neededCategories: [],
        needsStatement: '',
      });
    }
  }, [charityNeeds]);

  // Debug categories loading
  useEffect(() => {
    console.log('Categories loaded:', categories?.length || 0, 'categories');
    console.log('Form data neededCategories:', formData.neededCategories);
  }, [categories, formData.neededCategories]);

  const handleCategoryAdd = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      neededCategories: [...prev.neededCategories, categoryId]
    }));
  };

  const handleCategoryRemove = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      neededCategories: prev.neededCategories.filter(id => id !== categoryId)
    }));
  };

  const openConfirmationModal = (title, message, onConfirm) => {
    setModalState({ isOpen: true, title, message, onConfirm });
  };

  const closeConfirmationModal = () => {
    setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  };

  const handleConfirm = () => {
    modalState.onConfirm();
    closeConfirmationModal();
  };

  const handleRemoveSingleCategory = (categoryId) => {
    openConfirmationModal(
      'Remove Category?',
      'Are you sure you want to remove this category from your requirements?',
      () => {
        const updatedCategoryIds = charityNeeds.neededCategories
          .filter(cat => cat._id !== categoryId)
          .map(cat => cat._id);

        const updatedData = {
          neededCategories: updatedCategoryIds,
          needsStatement: charityNeeds.needsStatement || ''
        };

        setNeeds(updatedData);
      }
    );
  };

  const handleSave = () => {
    // Temporarily remove the alert for a smoother UX, can be replaced by a more robust validation system
    if (formData.neededCategories.length === 0) {
      // alert('Please select at least one category');
      // return;
    }

    setNeeds(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (charityNeeds) {
      const categoryIds = charityNeeds.neededCategories?.map(cat => cat._id) || [];
      setFormData({
        neededCategories: categoryIds,
        needsStatement: charityNeeds.needsStatement || '',
      });
    } else {
      setFormData({
        neededCategories: [],
        needsStatement: '',
      });
    }
    setIsEditing(false);
  };

  const handleClear = () => {
    openConfirmationModal(
      'Clear All Requirements?',
      'Are you sure you want to clear your entire requirements list? This action cannot be undone.',
      () => {
        clearNeeds();
        setIsEditing(false);
      }
    );
  };

  const getSelectedCategories = () => {
    if (!categories || !formData.neededCategories) return [];

    return formData.neededCategories.map(id => {
      const category = categories.find(cat => cat._id === id);
      if (!category) {
        // If category not found, create a temporary object with the ID
        console.warn(`Category with ID ${id} not found in categories list`);
        return { _id: id, name: `Category ${id}` };
      }
      return category;
    }).filter(Boolean);
  };

  const getAvailableCategories = () => {
    if (!categories) return [];
    return categories.filter(cat =>
      !formData.neededCategories.includes(cat._id)
    );
  };

  const getCategoryName = (categoryId) => {
    if (!categories) return 'Loading...';
    const category = categories.find(cat => cat._id === categoryId);
    return category?.name || `Category ${categoryId}`;
  };

  if (isLoadingNeeds) {
    return (
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ghibli-blue"></div>
          <span className="ml-3 text-ghibli-brown">Loading your requirements list...</span>
        </div>
      </div>
    );
  }

  if (isErrorNeeds) {
    return (
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <div className="flex items-center justify-center py-8">
          <ExclamationTriangleIcon className="h-8 w-8 text-ghibli-red mr-3" />
          <div>
            <p className="text-ghibli-red font-medium">Failed to load your requirements list</p>
            <button
              onClick={() => refetchNeeds()}
              className="text-ghibli-blue hover:text-ghibli-dark-blue text-sm font-medium mt-1"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light">
        <div className="p-6 border-b border-ghibli-brown-light">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-ghibli-dark-blue handwritten">
                Organization Requirements
              </h2>
              <p className="text-ghibli-brown mt-1">
                Let donors know what your organization needs most
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {charityNeeds && !isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-ghibli-blue text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={isClearingNeeds}
                    className="flex items-center space-x-2 px-4 py-2 bg-ghibli-red text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>{isClearingNeeds ? 'Clearing...' : 'Clear All'}</span>
                  </button>
                </>
              )}
              {!charityNeeds && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-ghibli-green text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Create Requirements List</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {!charityNeeds && !isEditing ? (
            <div className="text-center py-8">
              <HeartIcon className="h-16 w-16 text-ghibli-brown-light mx-auto mb-4" />
              <h3 className="text-lg font-medium text-ghibli-dark-blue mb-2">
                No Requirements List Created Yet
              </h3>
              <p className="text-ghibli-brown mb-4">
                Create a requirements list to let donors know what your organization needs most.
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-ghibli-green text-white rounded-lg hover:bg-opacity-90 transition-colors mx-auto"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Create Your First Requirements List</span>
              </button>
            </div>
          ) : isEditing ? (
            <div className="space-y-6">
              {/* Statement Input */}
              <div>
                <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
                  Requirements Statement
                </label>
                <textarea
                  value={formData.needsStatement}
                  onChange={(e) => setFormData(prev => ({ ...prev, needsStatement: e.target.value }))}
                  placeholder="Describe what your organization currently needs (e.g., We are preparing for winter and need warm clothing for all ages...)"
                  rows={4}
                  className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent resize-none"
                />
              </div>

              {/* Selected Categories */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-ghibli-dark-blue">
                    Selected Categories ({formData.neededCategories.length})
                  </label>
                  {formData.neededCategories.length > 0 && (
                    <span className="text-xs text-ghibli-brown">
                      Click the × to remove categories
                    </span>
                  )}
                </div>

                {formData.neededCategories.length === 0 ? (
                  <div className="p-6 border-2 border-dashed border-ghibli-brown-light rounded-lg text-center">
                    <p className="text-ghibli-brown text-sm">
                      No categories selected yet. Choose from available categories below.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-ghibli-teal bg-opacity-5 border border-ghibli-teal border-opacity-20 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {isLoadingCategories ? (
                        // Show selected category IDs while categories are loading
                        formData.neededCategories.map((categoryId) => (
                          <div
                            key={categoryId}
                            className="flex items-center space-x-2 px-3 py-2 bg-ghibli-teal text-white rounded-full text-sm font-medium"
                          >
                            <span>Loading category...</span>
                            <button
                              onClick={() => handleCategoryRemove(categoryId)}
                              className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5 transition-colors"
                            >
                              <XMarkIcon className="h-3 w-3" />
                            </button>
                          </div>
                        ))
                      ) : (
                        // Show actual category names when categories are loaded
                        getSelectedCategories().map((category) => (
                          <div
                            key={category._id}
                            className="flex items-center space-x-2 px-3 py-2 bg-ghibli-teal text-white rounded-full text-sm font-medium"
                          >
                            <span>{category.name}</span>
                            <button
                              onClick={() => handleCategoryRemove(category._id)}
                              className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5 transition-colors"
                            >
                              <XMarkIcon className="h-3 w-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Available Categories to Add */}
              <div>
                <label className="block text-sm font-medium text-ghibli-dark-blue mb-3">
                  Add More Categories
                </label>
                {isLoadingCategories ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-ghibli-blue"></div>
                    <span className="ml-2 text-ghibli-brown">Loading categories...</span>
                  </div>
                ) : getAvailableCategories().length === 0 ? (
                  <div className="p-4 border border-ghibli-brown-light rounded-lg text-center">
                    <p className="text-ghibli-brown text-sm">
                      All available categories have been selected!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {getAvailableCategories().map((category) => (
                      <button
                        key={category._id}
                        onClick={() => handleCategoryAdd(category._id)}
                        className="flex items-center justify-between p-3 border-2 border-ghibli-brown-light rounded-lg hover:border-ghibli-teal hover:bg-ghibli-teal hover:bg-opacity-5 transition-all text-left"
                      >
                        <span className="text-sm font-medium text-ghibli-dark-blue">
                          {category.name}
                        </span>
                        <PlusIcon className="h-4 w-4 text-ghibli-teal" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-ghibli-brown-light">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 text-ghibli-brown border border-ghibli-brown-light rounded-lg hover:bg-ghibli-cream-lightest transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSettingNeeds || formData.neededCategories.length === 0}
                  className="flex items-center space-x-2 px-6 py-2 bg-ghibli-green text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>{isSettingNeeds ? 'Saving...' : 'Save Requirements List'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Statement */}
              {charityNeeds.needsStatement && (
                <div className="p-4 bg-ghibli-cream-lightest rounded-lg">
                  <h3 className="font-medium text-ghibli-dark-blue mb-2">Our Current Requirements</h3>
                  <p className="text-ghibli-brown">{charityNeeds.needsStatement}</p>
                </div>
              )}

              {/* Current Categories as Cards */}
              <div>
                <h3 className="font-medium text-ghibli-dark-blue mb-4">Categories We Need</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {charityNeeds.neededCategories?.map((category) => (
                    <div
                      key={category._id}
                      className="p-4 bg-white border border-ghibli-brown-light rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-ghibli-dark-blue mb-1">
                            {category.name}
                          </h4>
                          {category.description && (
                            <p className="text-sm text-ghibli-brown">
                              {category.description}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveSingleCategory(category._id)}
                          disabled={isSettingNeeds}
                          className="ml-3 p-1.5 text-ghibli-red hover:bg-ghibli-red hover:text-white rounded-lg transition-colors disabled:opacity-50"
                          title="Remove this category"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="p-4 bg-ghibli-blue bg-opacity-10 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-ghibli-blue mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-ghibli-dark-blue">Your requirements list is live!</p>
                    <p className="text-xs text-ghibli-brown mt-1">
                      Donors can now see what your organization needs and contribute accordingly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirm}
        title={modalState.title}
        message={modalState.message}
        isLoading={isSettingNeeds || isClearingNeeds}
      />
    </>
  );
};

export default NeedsManager;
