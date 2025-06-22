import React from 'react';
import { MagnifyingGlassIcon, MapPinIcon, SparklesIcon } from '@heroicons/react/24/outline';

const SearchAndFilterBar = ({
  search,
  onSearchChange,
  location,
  onLocationChange,
  priority,
  onPriorityChange,
}) => (
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
    {/* Priority */}
    <div className="relative flex-1">
      <SparklesIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ghibli-teal" />
      <input
        type="text"
        placeholder="Filter by priority item..."
        value={priority}
        onChange={e => onPriorityChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-xl border border-ghibli-brown-light bg-white shadow-ghibli focus:outline-none focus:ring-2 focus:ring-ghibli-teal focus:border-ghibli-teal transition-all text-ghibli-dark-blue placeholder-ghibli-brown"
      />
    </div>
  </div>
);

export default SearchAndFilterBar;
