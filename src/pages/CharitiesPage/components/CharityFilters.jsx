import React, { useState, useRef, useEffect } from 'react';
import {
  TagIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  XMarkIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const CategoryMultiSelect = ({
  categories = [],
  selectedCategories = [],
  onCategoriesChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryToggle = (categoryId) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    onCategoriesChange(newSelection);
  };

  const getSelectedCategoryNames = () => {
    return selectedCategories.map(categoryId => {
      const category = categories.find(cat => cat._id === categoryId);
      return category ? category.name : '';
    }).filter(Boolean);
  };

  const selectedNames = getSelectedCategoryNames();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border border-ghibli-brown-light rounded-xl bg-white hover:border-ghibli-teal focus:outline-none focus:ring-2 focus:ring-ghibli-teal focus:border-ghibli-teal transition-all"
      >
        <div className="flex items-center gap-2">
          <TagIcon className="h-5 w-5 text-ghibli-teal" />
          <span className="text-ghibli-dark-blue">
            {selectedCategories.length === 0
              ? 'Filter by categories...'
              : `${selectedCategories.length} categories selected`
            }
          </span>
        </div>
        <ChevronDownIcon className={`h-5 w-5 text-ghibli-brown transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {selectedNames.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedNames.slice(0, 3).map((name, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-3 py-1 bg-ghibli-teal text-white text-sm rounded-full"
            >
              {name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const categoryId = categories.find(cat => cat.name === name)?._id;
                  if (categoryId) handleCategoryToggle(categoryId);
                }}
                className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
          {selectedNames.length > 3 && (
            <span className="inline-flex items-center px-3 py-1 bg-ghibli-brown-light text-ghibli-brown text-sm rounded-full">
              +{selectedNames.length - 3} more
            </span>
          )}
        </div>
      )}

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-ghibli-brown-light rounded-xl shadow-lg max-h-64 overflow-hidden">
          <div className="p-3 border-b border-ghibli-brown-light">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-ghibli-brown-light rounded-lg focus:outline-none focus:ring-1 focus:ring-ghibli-teal"
            />
          </div>

          <div className="max-h-48 overflow-y-auto">
            {filteredCategories.length === 0 ? (
              <div className="p-3 text-sm text-ghibli-brown text-center">
                No categories found
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div
                  key={category._id}
                  onClick={() => handleCategoryToggle(category._id)}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-ghibli-cream-lightest flex items-center gap-2 ${
                    selectedCategories.includes(category._id) ? 'bg-ghibli-teal-lightest' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => {}}
                    className="w-4 h-4 text-ghibli-teal border-ghibli-brown-light rounded focus:ring-ghibli-teal"
                  />
                  <span className="flex-1">{category.name}</span>
                </div>
              ))
            )}
          </div>

          {selectedCategories.length > 0 && (
            <div className="p-2 border-t border-ghibli-brown-light">
              <button
                onClick={() => onCategoriesChange([])}
                className="w-full px-3 py-1 text-xs text-ghibli-red hover:bg-ghibli-red hover:text-white rounded transition-colors"
              >
                Clear All Categories
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CharityFilters = ({
  selectedCategories,
  onCategoriesChange,
  verificationFilter,
  onVerificationFilterChange,
  categories,
  onClearFilters,
  hasActiveFilters
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const verificationOptions = [
    { value: 'all', label: 'All Charities', count: null },
    { value: 'verified', label: 'Verified Only', count: null },
    { value: 'pending', label: 'Pending Verification', count: null }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-ghibli-blue hover:text-ghibli-blue-dark transition-colors"
        >
          <FunnelIcon className="h-5 w-5" />
          <span className="font-medium">
            {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
          </span>
          <ChevronDownIcon className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-ghibli-red hover:text-ghibli-red-dark transition-colors font-medium"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-ghibli-cream-lightest rounded-xl border border-ghibli-brown-light">
          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
              Categories
            </label>
            <CategoryMultiSelect
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoriesChange={onCategoriesChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
              Verification Status
            </label>
            <div className="relative">
              <select
                value={verificationFilter}
                onChange={(e) => onVerificationFilterChange(e.target.value)}
                className="w-full px-4 py-3 border border-ghibli-brown-light rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-ghibli-teal focus:border-ghibli-teal transition-all appearance-none"
              >
                {verificationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <CheckCircleIcon className="h-5 w-5 text-ghibli-teal" />
              </div>
            </div>
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-ghibli-blue bg-opacity-10 rounded-lg border border-ghibli-blue border-opacity-20">
          <span className="text-sm font-medium text-ghibli-dark-blue">Active filters:</span>

          {selectedCategories.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-ghibli-teal text-white text-xs rounded-full">
              {selectedCategories.length} categories
              <button
                onClick={() => onCategoriesChange([])}
                className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          )}

          {verificationFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-ghibli-blue text-white text-xs rounded-full">
              {verificationOptions.find(opt => opt.value === verificationFilter)?.label}
              <button
                onClick={() => onVerificationFilterChange('all')}
                className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            onClick={onClearFilters}
            className="text-xs text-ghibli-red hover:text-ghibli-red-dark transition-colors underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default CharityFilters;
