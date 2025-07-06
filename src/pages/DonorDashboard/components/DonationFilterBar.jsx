import React, { useState, useRef, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  TagIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useCharities } from '../../../hooks/useCharities';
import { useCategories } from '../../../hooks/useCategories';

// Multi-select dropdown component
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
        className="relative flex items-center w-full pl-10 pr-8 py-2 rounded-lg border border-ghibli-brown-light bg-ghibli-cream-lightest focus-within:ring-2 focus-within:ring-ghibli-teal focus-within:border-ghibli-teal transition-all cursor-pointer min-w-[200px]"
      >
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ghibli-teal pointer-events-none" />

        <div className="flex-1 flex flex-wrap gap-1 items-center min-h-[20px]">
          {selectedValues.length === 0 ? (
            <span className="text-ghibli-brown text-sm">{placeholder}</span>
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
                    className="cursor-pointer hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <XMarkIcon className="cursor-pointer h-3 w-3" />
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
                className="cursor-pointer w-full px-3 py-1 text-xs text-ghibli-red hover:bg-ghibli-red hover:text-white rounded transition-colors"
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

const DonationFilterBar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  selectedCharities,
  onCharitiesChange,
  selectedCategories,
  onCategoriesChange,
  urgency,
  onUrgencyChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
}) => {
  // Fetch data
  const { data: charities = [], isLoading: isLoadingCharities } = useCharities();
  const { categories = [], isLoading: isLoadingCategories } = useCategories();

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const urgencyOptions = [
    { value: '', label: 'All Urgency' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 3 months' },
    { value: '365', label: 'Last year' },
  ];

  // Transform data for dropdowns
  const charityOptions = charities.map(charity => ({
    value: charity._id,
    label: charity.charityName || charity.name || 'Unnamed Charity'
  }));

  const categoryOptions = categories.map(category => ({
    value: category._id,
    label: category.name || 'Unnamed Category'
  }));

  const hasActiveFilters = search || status || selectedCharities?.length > 0 ||
                          selectedCategories?.length > 0 || urgency || dateRange;

  return (
    <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-4 mb-6">
      <div className="flex flex-col gap-4">
        {/* First Row */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ghibli-teal" />
            <input
              type="text"
              placeholder="Search donations by items, pickup address..."
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-ghibli-brown-light bg-ghibli-cream-lightest focus:outline-none focus:ring-2 focus:ring-ghibli-teal focus:border-ghibli-teal transition-all text-ghibli-dark-blue placeholder-ghibli-brown text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <CheckCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ghibli-teal pointer-events-none" />
            <select
              value={status}
              onChange={e => onStatusChange(e.target.value)}
              className="pl-10 pr-8 py-2 rounded-lg border border-ghibli-brown-light bg-ghibli-cream-lightest focus:outline-none focus:ring-2 focus:ring-ghibli-teal focus:border-ghibli-teal transition-all text-ghibli-dark-blue text-sm appearance-none cursor-pointer min-w-[140px]"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency Filter */}
          <div className="relative">
            <ExclamationTriangleIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ghibli-teal pointer-events-none" />
            <select
              value={urgency}
              onChange={e => onUrgencyChange(e.target.value)}
              className="pl-10 pr-8 py-2 rounded-lg border border-ghibli-brown-light bg-ghibli-cream-lightest focus:outline-none focus:ring-2 focus:ring-ghibli-teal focus:border-ghibli-teal transition-all text-ghibli-dark-blue text-sm appearance-none cursor-pointer min-w-[130px]"
            >
              {urgencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="relative">
            <CalendarDaysIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ghibli-teal pointer-events-none" />
            <select
              value={dateRange}
              onChange={e => onDateRangeChange(e.target.value)}
              className="pl-10 pr-8 py-2 rounded-lg border border-ghibli-brown-light bg-ghibli-cream-lightest focus:outline-none focus:ring-2 focus:ring-ghibli-teal focus:border-ghibli-teal transition-all text-ghibli-dark-blue text-sm appearance-none cursor-pointer min-w-[140px]"
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Row - Multi-select dropdowns */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Charity Multi-select */}
          <div className="flex-1">
            <MultiSelectDropdown
              options={charityOptions}
              selectedValues={selectedCharities || []}
              onSelectionChange={onCharitiesChange}
              placeholder="Filter by charities..."
              icon={BuildingOfficeIcon}
              isLoading={isLoadingCharities}
            />
          </div>

          {/* Category Multi-select */}
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

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="cursor-pointer px-6 py-2 bg-ghibli-red text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium whitespace-nowrap self-start"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationFilterBar;
