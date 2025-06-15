import React, { useState, useEffect, useRef } from 'react';
import {
  MapPinIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  StarIcon,
  BuildingOfficeIcon,
  HomeIcon,
  MapIcon
} from '@heroicons/react/24/outline';
import { searchLocations, getNearbyPlaces, getCurrentLocation } from '../services/geocodingService';

const AddressInput = ({
  value,
  onChange,
  placeholder = "Search for places, addresses, or landmarks",
  label = "Location",
  required = false,
  className = "",
  disabled = false,
  showNearbyPlaces = true,
  showCategories = true
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [userLocation, setUserLocation] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'nearby', 'recent'

  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  // Get user location on mount
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const location = await getCurrentLocation();
        if (!location.error) {
          setUserLocation(location.coordinates);
        }
      } catch (error) {
        console.error('Error getting user location:', error);
      }
    };

    getUserLocation();
  }, []);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('addressSearchHistory');
    if (history) {
      try {
        setSearchHistory(JSON.parse(history));
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value && value.length >= 2) {
      debounceRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const results = await searchLocations(value, {
            limit: 6, // Reduced to avoid rate limiting
            userLocation: userLocation,
            includeCategories: true,
            searchRadius: 25 // Smaller radius to reduce API load
          });
          setSuggestions(results);
          setActiveTab('search');
          setShowSuggestions(results.length > 0 || nearbyPlaces.length > 0 || searchHistory.length > 0);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);

          // Show fallback suggestions for common areas
          if (value.toLowerCase().includes('westla')) {
            setSuggestions([{
              id: 'fallback-westlands',
              address: 'Westlands, Nairobi, Kenya',
              shortName: 'Westlands',
              coordinates: [-1.2676, 36.8108],
              category: 'area',
              type: 'suburb',
              importance: 0.8,
              distance: null,
              details: { suburb: 'Westlands', city: 'Nairobi' },
              icon: '📍'
            }]);
            setActiveTab('search');
            setShowSuggestions(true);
          }
        } finally {
          setIsLoading(false);
        }
      }, 500); // Increased debounce time to reduce API calls
    } else {
      setSuggestions([]);
      if (showSuggestions) {
        setActiveTab(nearbyPlaces.length > 0 ? 'nearby' : 'recent');
      }
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, userLocation, nearbyPlaces.length, searchHistory.length, showSuggestions]);

  // Load nearby places when user location is available
  useEffect(() => {
    const loadNearbyPlaces = async () => {
      if (userLocation && showNearbyPlaces) {
        try {
          const places = await getNearbyPlaces(userLocation, [], 5); // Smaller radius
          setNearbyPlaces(places);
        } catch (error) {
          console.error('Error loading nearby places:', error);
          // Don't show error to user, just log it
          setNearbyPlaces([]);
        }
      }
    };

    // Add delay to avoid immediate API call on mount
    const timeoutId = setTimeout(loadNearbyPlaces, 1000);
    return () => clearTimeout(timeoutId);
  }, [userLocation, showNearbyPlaces]);

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setSelectedIndex(-1);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    const address = suggestion.address || suggestion.name || suggestion;
    onChange(address);

    // Add to search history
    const newHistoryItem = {
      address: address,
      shortName: suggestion.shortName || suggestion.name || address,
      category: suggestion.category || 'other',
      icon: suggestion.icon || '📍',
      timestamp: Date.now()
    };

    const updatedHistory = [
      newHistoryItem,
      ...searchHistory.filter(item => item.address !== address)
    ].slice(0, 10); // Keep only last 10 searches

    setSearchHistory(updatedHistory);
    localStorage.setItem('addressSearchHistory', JSON.stringify(updatedHistory));

    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (suggestions.length > 0 || nearbyPlaces.length > 0 || searchHistory.length > 0) {
      setShowSuggestions(true);
      if (value && value.length >= 2) {
        setActiveTab('search');
      } else {
        setActiveTab(nearbyPlaces.length > 0 ? 'nearby' : 'recent');
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    const currentList = getCurrentList();
    if (!showSuggestions || currentList.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < currentList.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : currentList.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < currentList.length) {
          handleSuggestionSelect(currentList[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        // Allow tab navigation between tabs
        if (e.shiftKey) {
          e.preventDefault();
          const tabs = ['search', 'nearby', 'recent'].filter(tab => getTabData(tab).length > 0);
          const currentIndex = tabs.indexOf(activeTab);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          setActiveTab(tabs[prevIndex]);
          setSelectedIndex(-1);
        } else if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const tabs = ['search', 'nearby', 'recent'].filter(tab => getTabData(tab).length > 0);
          const currentIndex = tabs.indexOf(activeTab);
          const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
          setActiveTab(tabs[nextIndex]);
          setSelectedIndex(-1);
        }
        break;
    }
  };

  // Get current list based on active tab
  const getCurrentList = () => {
    return getTabData(activeTab);
  };

  // Get data for specific tab
  const getTabData = (tab) => {
    switch (tab) {
      case 'search':
        return suggestions;
      case 'nearby':
        return nearbyPlaces;
      case 'recent':
        return searchHistory;
      default:
        return [];
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get category icon component
  const getCategoryIcon = (category, type) => {
    switch (category) {
      case 'business':
        return <BuildingOfficeIcon className="h-4 w-4" />;
      case 'address':
        return <HomeIcon className="h-4 w-4" />;
      case 'landmark':
        return <StarIcon className="h-4 w-4" />;
      case 'area':
        return <MapIcon className="h-4 w-4" />;
      default:
        return <MapPinIcon className="h-4 w-4" />;
    }
  };

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('addressSearchHistory');
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
          {label} {required && <span className="text-ghibli-red">*</span>}
        </label>
      )}

      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-ghibli-brown" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          className="w-full pl-10 pr-10 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent transition-colors text-ghibli-dark-blue placeholder-ghibli-brown"
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete="off"
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-ghibli-teal"></div>
          </div>
        )}

        {/* Clear button */}
        {value && !isLoading && (
          <button
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-3 text-ghibli-brown hover:text-ghibli-dark-blue transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Enhanced suggestions dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-ghibli-brown-light rounded-lg shadow-xl max-h-96 overflow-hidden"
        >
          {/* Tab navigation */}
          <div className="flex border-b border-ghibli-brown-light bg-ghibli-cream-lightest">
            {suggestions.length > 0 && (
              <button
                onClick={() => setActiveTab('search')}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'search'
                    ? 'text-ghibli-teal border-b-2 border-ghibli-teal bg-white'
                    : 'text-ghibli-brown hover:text-ghibli-dark-blue'
                }`}
              >
                Search Results ({suggestions.length})
              </button>
            )}
            {nearbyPlaces.length > 0 && showNearbyPlaces && (
              <button
                onClick={() => setActiveTab('nearby')}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'nearby'
                    ? 'text-ghibli-teal border-b-2 border-ghibli-teal bg-white'
                    : 'text-ghibli-brown hover:text-ghibli-dark-blue'
                }`}
              >
                Nearby Places
              </button>
            )}
            {searchHistory.length > 0 && (
              <button
                onClick={() => setActiveTab('recent')}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'recent'
                    ? 'text-ghibli-teal border-b-2 border-ghibli-teal bg-white'
                    : 'text-ghibli-brown hover:text-ghibli-dark-blue'
                }`}
              >
                Recent
              </button>
            )}
          </div>

          {/* Content area */}
          <div className="max-h-80 overflow-y-auto">
            {/* Search Results */}
            {activeTab === 'search' && suggestions.length > 0 && (
              <div>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.id || index}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className={`px-4 py-3 cursor-pointer border-b border-ghibli-brown-light last:border-b-0 transition-colors ${
                      index === selectedIndex
                        ? 'bg-ghibli-teal text-white'
                        : 'hover:bg-ghibli-cream-lightest'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`mt-0.5 flex-shrink-0 ${
                        index === selectedIndex ? 'text-white' : 'text-ghibli-teal'
                      }`}>
                        {getCategoryIcon(suggestion.category, suggestion.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className={`text-sm font-medium truncate ${
                            index === selectedIndex ? 'text-white' : 'text-ghibli-dark-blue'
                          }`}>
                            {suggestion.shortName}
                          </p>
                          <span className="text-xs">{suggestion.icon}</span>
                        </div>
                        <p className={`text-xs truncate ${
                          index === selectedIndex ? 'text-white opacity-90' : 'text-ghibli-brown'
                        }`}>
                          {suggestion.address}
                        </p>
                        {suggestion.distance && (
                          <p className={`text-xs ${
                            index === selectedIndex ? 'text-white opacity-75' : 'text-ghibli-brown'
                          }`}>
                            {suggestion.distance} km away
                          </p>
                        )}
                      </div>
                      {index === selectedIndex && (
                        <CheckIcon className="h-4 w-4 text-white flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Nearby Places */}
            {activeTab === 'nearby' && nearbyPlaces.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-ghibli-cream-lightest border-b border-ghibli-brown-light">
                  <p className="text-xs text-ghibli-brown font-medium">
                    Places near you
                  </p>
                </div>
                {nearbyPlaces.map((place, index) => (
                  <div
                    key={place.id || index}
                    onClick={() => handleSuggestionSelect(place)}
                    className={`px-4 py-3 cursor-pointer border-b border-ghibli-brown-light last:border-b-0 transition-colors ${
                      index === selectedIndex
                        ? 'bg-ghibli-teal text-white'
                        : 'hover:bg-ghibli-cream-lightest'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`mt-0.5 flex-shrink-0 ${
                        index === selectedIndex ? 'text-white' : 'text-ghibli-teal'
                      }`}>
                        {getCategoryIcon(place.category, place.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          index === selectedIndex ? 'text-white' : 'text-ghibli-dark-blue'
                        }`}>
                          {place.name}
                        </p>
                        <p className={`text-xs truncate ${
                          index === selectedIndex ? 'text-white opacity-90' : 'text-ghibli-brown'
                        }`}>
                          {place.address}
                        </p>
                        <p className={`text-xs ${
                          index === selectedIndex ? 'text-white opacity-75' : 'text-ghibli-brown'
                        }`}>
                          {place.distance} km away
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {activeTab === 'recent' && searchHistory.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-ghibli-cream-lightest border-b border-ghibli-brown-light flex items-center justify-between">
                  <p className="text-xs text-ghibli-brown font-medium">
                    Recent searches
                  </p>
                  <button
                    onClick={clearSearchHistory}
                    className="text-xs text-ghibli-teal hover:text-ghibli-dark-blue transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                {searchHistory.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionSelect(item)}
                    className={`px-4 py-3 cursor-pointer border-b border-ghibli-brown-light last:border-b-0 transition-colors ${
                      index === selectedIndex
                        ? 'bg-ghibli-teal text-white'
                        : 'hover:bg-ghibli-cream-lightest'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <ClockIcon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                        index === selectedIndex ? 'text-white' : 'text-ghibli-brown'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className={`text-sm font-medium truncate ${
                            index === selectedIndex ? 'text-white' : 'text-ghibli-dark-blue'
                          }`}>
                            {item.shortName}
                          </p>
                          <span className="text-xs">{item.icon}</span>
                        </div>
                        <p className={`text-xs truncate ${
                          index === selectedIndex ? 'text-white opacity-90' : 'text-ghibli-brown'
                        }`}>
                          {item.address}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty states */}
            {activeTab === 'search' && suggestions.length === 0 && !isLoading && value.length >= 2 && (
              <div className="px-4 py-6 text-center">
                <MagnifyingGlassIcon className="h-8 w-8 text-ghibli-brown mx-auto mb-2" />
                <p className="text-sm text-ghibli-brown">No places found</p>
                <p className="text-xs text-ghibli-brown mt-1">
                  Try different keywords or check spelling
                </p>
              </div>
            )}

            {activeTab === 'nearby' && nearbyPlaces.length === 0 && (
              <div className="px-4 py-6 text-center">
                <MapPinIcon className="h-8 w-8 text-ghibli-brown mx-auto mb-2" />
                <p className="text-sm text-ghibli-brown">No nearby places found</p>
                <p className="text-xs text-ghibli-brown mt-1">
                  Enable location access for better results
                </p>
              </div>
            )}

            {activeTab === 'recent' && searchHistory.length === 0 && (
              <div className="px-4 py-6 text-center">
                <ClockIcon className="h-8 w-8 text-ghibli-brown mx-auto mb-2" />
                <p className="text-sm text-ghibli-brown">No recent searches</p>
                <p className="text-xs text-ghibli-brown mt-1">
                  Your search history will appear here
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-ghibli-cream-lightest border-t border-ghibli-brown-light">
            <div className="flex items-center justify-between">
              <p className="text-xs text-ghibli-brown">
                Powered by OpenStreetMap
              </p>
              <div className="text-xs text-ghibli-brown">
                <span className="hidden sm:inline">Use ↑↓ to navigate • </span>
                <span>Enter to select</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressInput;
