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
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
      <input
        type="text"
        placeholder="Search charities..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-xl border border-indigo-200 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition font-sans text-black"
        style={{ boxShadow: '0 2px 12px rgba(80,80,180,0.10)' }}
      />
    </div>
    {/* Location */}
    <div className="relative flex-1">
      <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
      <input
        type="text"
        placeholder="Filter by location..."
        value={location}
        onChange={e => onLocationChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-xl border border-indigo-200 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition font-sans text-black"
        style={{ boxShadow: '0 2px 12px rgba(80,80,180,0.10)' }}
      />
    </div>
    {/* Priority */}
    <div className="relative flex-1">
      <SparklesIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
      <input
        type="text"
        placeholder="Filter by priority item..."
        value={priority}
        onChange={e => onPriorityChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-xl border border-indigo-200 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition font-sans text-black"
        style={{ boxShadow: '0 2px 12px rgba(80,80,180,0.10)' }}
      />
    </div>
  </div>
);

export default SearchAndFilterBar;
