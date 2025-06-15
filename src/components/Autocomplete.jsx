import React, { useState, useEffect, useRef } from 'react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline';

const Autocomplete = ({
  options = [],
  value,
  onChange,
  optionLabelKey,
  optionValueKey,
  label,
  placeholder,
  isLoading = false,
  isError = false,
  required = false,
  icon: Icon
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value) {
      const selectedOption = options.find(option => option[optionValueKey] === value);
      if (selectedOption) {
        setInputValue(selectedOption[optionLabelKey]);
      }
    } else {
        setInputValue('');
    }
  }, [value, options, optionValueKey, optionLabelKey]);

  useEffect(() => {
    if (isOpen) {
        if (inputValue) {
            setFilteredOptions(
                options.filter(option =>
                option[optionLabelKey].toLowerCase().includes(inputValue.toLowerCase())
                )
            );
        } else {
            setFilteredOptions(options);
        }
    }
  }, [inputValue, options, optionLabelKey, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        if (value) {
            const selectedOption = options.find(option => option[optionValueKey] === value);
            if(selectedOption) setInputValue(selectedOption[optionLabelKey]);
            else setInputValue('');
        } else {
            setInputValue('');
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, value, options, optionValueKey, optionLabelKey]);


  const handleSelectOption = (option) => {
    onChange(option[optionValueKey]);
    setInputValue(option[optionLabelKey]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {label && (
        <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
          {label} {required && <span className="text-ghibli-red">*</span>}
        </label>
      )}
      <div className="relative">
         {Icon && <Icon className="absolute left-3 top-3.5 h-5 w-5 text-ghibli-brown" />}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === '') {
                onChange('');
            }
          }}
          onFocus={() => {
            setFilteredOptions(options);
            setIsOpen(true);
          }}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-10 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent transition-colors text-ghibli-dark-blue placeholder-ghibli-brown`}
          placeholder={placeholder}
          required={required}
          disabled={isLoading || isError}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <ChevronUpDownIcon className="h-5 w-5 text-ghibli-brown" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {isLoading && <li className="px-4 py-2 text-ghibli-brown">Loading...</li>}
          {isError && <li className="px-4 py-2 text-ghibli-red">Error loading data.</li>}
          {!isLoading && !isError && filteredOptions.length === 0 ? (
            <div className="relative cursor-default select-none py-2 px-4 text-ghibli-brown">
              Nothing found.
            </div>
          ) : (
            filteredOptions.map(option => (
              <li
                key={option[optionValueKey]}
                onClick={() => handleSelectOption(option)}
                className="relative group cursor-pointer select-none py-2 pl-10 pr-4 text-ghibli-dark-blue hover:bg-ghibli-teal hover:text-white"
              >
                <span className={`block truncate ${value === option[optionValueKey] ? 'font-medium' : 'font-normal'}`}>
                  {option[optionLabelKey]}
                </span>
                {value === option[optionValueKey] ? (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ghibli-teal group-hover:text-white">
                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                ) : null}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
