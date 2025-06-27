import React, { useState, useRef, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  TagIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useCategories } from '../../../hooks/useCategories';

// Multi-select dropdown component (reused from DonationFilterBar)
const MultiSelectDropdown = ({
  options = [],
  selectedValues = [],
  onSelectionChange,
  placeholder,
  icon: Icon,
  isLoading = false
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

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionToggle = (optionValue) => {
    const newSelection = selectedValues.includes(optionValue)
      ? selectedValues.filter(val => val !== optionValue)
      : [...selectedValues, optionValue];
    onSelectionChange(newSelection);
  };

  const removeSelection = (valueToRemove) => {
    onSelectionChange(selectedValues.filter(val => val !== valueToRemove));
  };

  const getSelectedLabels = () => {
    return selectedValues.map(value => {
      const option = options.find(opt => opt.value === value);
      return option ? option.label : value;
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Input */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center w-full pl-10 pr-8 py-2 rounded-xl border border-ghibli-brown-light bg-white shadow-ghibli focus-within:ring-2 focus-within:ring-ghibli-teal focus-within:border-ghibli-teal transition-all cursor-pointer min-w-[200px]"
      >
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ghibli-teal pointer-events-none" />

        <div className="flex-1 flex flex-wrap gap-1 items-center min-h-[20px]">
          {selectedValues.length === 0 ? (
            <span className="text-ghibli-brown">{placeholder}</span>
          ) : (
            <>
              {getSelectedLabels().slice(0, 2).map((label, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-ghibli-teal text-white text-xs rounded-md"
                >
                  {label}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelection(selectedValues[index]);
                    }}
                    className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {selectedValues.length > 2 && (
                <span className="text-xs text-ghibli-brown">
                  +{selectedValues.length - 2} more
                </span>
              )}
            </>
          )}
        </div>

        <ChevronDownIcon
          className={`absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-ghibli-teal transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-ghibli-brown-light rounded-lg shadow-lg z-50 max-h-60 flex flex-col">
          {/* Search Input */}
          <div className="p-2 border-b border-ghibli-brown-light">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-ghibli-brown-light rounded focus:outline-none focus:ring-1 focus:ring-ghibli-teal"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 text-center text-ghibli-brown text-sm">
                Loading...
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-ghibli-brown text-sm">
                {searchTerm ? 'No results found' : 'No options available'}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleOptionToggle(option.value)}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-ghibli-cream-lightest flex items-center gap-2 ${
                    selectedValues.includes(option.value) ? 'bg-ghibli-teal-lightest' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={() => {}} // Handled by parent onClick
                    className="w-4 h-4 text-ghibli-teal border-ghibli-brown-light rounded focus:ring-ghibli-teal"
                  />
                  <span className="flex-1">{option.label}</span>
                </div>
              ))
            )}
          </div>

          {/* Clear All Button */}
          {selectedValues.length > 0 && (
            <div className="p-2 border-t border-ghibli-brown-light">
              <button
                onClick={() => onSelectionChange([])}
                className="w-full px-3 py-1 text-xs text-ghibli-red hover:bg-ghibli-red hover:text-white rounded transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SearchAndFilterBar = ({
  search,
  onSearchChange,
  location,
  onLocationChange,
  selectedCategories,
  onCategoriesChange,
}) => {
  // Fetch categories
  const { categories = [], isLoading: isLoadingCategories } = useCategories();

  // Transform categories for dropdown
  const categoryOptions = categories.map(category => ({
    value: category._id,
    label: category.name || 'Unnamed Category'
  }));

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {/* Search */}
      <div className="relative flex-1">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ghibli-teal" />
        <input
          type="text"
          placeholder="Search charities..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-ghibli-brown-light bg-white shadow-ghibli focus:outline-none focus:ring-2 focus:ring-ghibli-teal focus:border-ghibli-teal transition-all text-ghibli-dark-blue placeholder-ghibli-brown"
        />
      </div>

      {/* Location */}
      <div className="relative flex-1">
        <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ghibli-teal" />
        <input
          type="text"
          placeholder="Filter by location..."
          value={location}
          onChange={e => onLocationChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-ghibli-brown-light bg-white shadow-ghibli focus:outline-none focus:ring-2 focus:ring-ghibli-teal focus:border-ghibli-teal transition-all text-ghibli-dark-blue placeholder-ghibli-brown"
        />
      </div>

      {/* Categories Multi-select */}
      <div className="flex-1">
        <MultiSelectDropdown
          options={categoryOptions}
          selectedValues={selectedCategories || []}
          onSelectionChange={onCategoriesChange}
          placeholder="Filter by categories..."
          icon={TagIcon}
          isLoading={isLoadingCategories}
        />
      </div>
    </div>
  );
};

export default SearchAndFilterBar;
