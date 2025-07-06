import React, { useState, useEffect } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  BellIcon,
  CogIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useAvailability } from '../../../hooks/useAvailability';
import {
  AVAILABILITY_TYPES,
  DAYS_OF_WEEK,
  DAY_NAMES,
  TRANSPORTATION_MODES,
  TRANSPORTATION_MODE_NAMES,
  validateAvailabilityData,
  formatTimeForDisplay,
  formatDateForDisplay,
  getDayName,
  createExampleAvailabilityData,
} from '../../../utils/availabilityUtils';

const AvailabilityView = () => {
  const [currentTab, setCurrentTab] = useState('schedule');
  const [availabilityType, setAvailabilityType] = useState(AVAILABILITY_TYPES.RECURRING_WEEKLY);
  const [formData, setFormData] = useState(createExampleAvailabilityData(AVAILABILITY_TYPES.RECURRING_WEEKLY));
  const [validationErrors, setValidationErrors] = useState([]);

  const {
    myAvailability,
    isLoadingAvailability,
    isErrorAvailability,
    setAvailability,
    isSettingAvailability,
    deleteAvailability,
    isDeletingAvailability,
    addUnavailability,
    isAddingUnavailability,
    unavailabilityPeriods,
    isLoadingUnavailability,
    removeUnavailability,
    isRemovingUnavailability,
    refetchAvailability,
  } = useAvailability();

  const [newUnavailability, setNewUnavailability] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });

  // Initialize form data when availability data loads
  useEffect(() => {
    if (myAvailability) {
      // Format dates from ISO strings to YYYY-MM-DD for form inputs
      const formattedAvailability = {
        ...myAvailability,
        specificDates: (myAvailability.specificDates || []).map(d => ({
          ...d,
          date: d.date ? d.date.split('T')[0] : '',
        })),
      };

      if (myAvailability.dateRange) {
        formattedAvailability.dateRange = {
          ...myAvailability.dateRange,
          startDate: myAvailability.dateRange.startDate ? myAvailability.dateRange.startDate.split('T')[0] : '',
          endDate: myAvailability.dateRange.endDate ? myAvailability.dateRange.endDate.split('T')[0] : '',
        };
      }

      setFormData(formattedAvailability);
      setAvailabilityType(myAvailability.type);
    } else {
      // If no availability is set, initialize with default example data for a recurring schedule
      const initialData = createExampleAvailabilityData(AVAILABILITY_TYPES.RECURRING_WEEKLY);
      setFormData(initialData);
      setAvailabilityType(AVAILABILITY_TYPES.RECURRING_WEEKLY);
    }
  }, [myAvailability]);

  const tabs = [
    { id: 'schedule', label: 'Availability Schedule', icon: CalendarIcon },
    { id: 'preferences', label: 'Service Preferences', icon: CogIcon },
    { id: 'unavailable', label: 'Unavailable Periods', icon: ClockIcon },
  ];

  const daysOfWeek = [
    { key: DAYS_OF_WEEK.MONDAY, label: 'Monday' },
    { key: DAYS_OF_WEEK.TUESDAY, label: 'Tuesday' },
    { key: DAYS_OF_WEEK.WEDNESDAY, label: 'Wednesday' },
    { key: DAYS_OF_WEEK.THURSDAY, label: 'Thursday' },
    { key: DAYS_OF_WEEK.FRIDAY, label: 'Friday' },
    { key: DAYS_OF_WEEK.SATURDAY, label: 'Saturday' },
    { key: DAYS_OF_WEEK.SUNDAY, label: 'Sunday' },
  ];

  const handleAvailabilityTypeChange = (newType) => {
    setAvailabilityType(newType);
    const exampleData = createExampleAvailabilityData(newType);
    setFormData({
      ...formData,
      ...exampleData,
      serviceArea: formData.serviceArea, // Preserve existing service area
      preferences: { ...formData.preferences, ...exampleData.preferences }, // Merge preferences
    });
    setValidationErrors([]);
  };

  const handleSaveAvailability = async () => {
    const validation = validateAvailabilityData(formData);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors([]);
    setAvailability(formData);
  };

  const handleDeleteAvailability = () => {
    if (window.confirm('Are you sure you want to delete your availability settings? This will make you unavailable for new pickup requests.')) {
      deleteAvailability();
    }
  };

  const handleAddUnavailability = () => {
    if (!newUnavailability.startDate || !newUnavailability.endDate) {
      return;
    }

    addUnavailability(newUnavailability);
    setNewUnavailability({ startDate: '', endDate: '', reason: '' });
  };

  // Helper functions for updating form data
  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const updateServiceArea = (updates) => {
    setFormData(prev => ({
      ...prev,
      serviceArea: { ...prev.serviceArea, ...updates }
    }));
  };

  const updatePreferences = (updates) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...updates }
    }));
  };

  const renderAvailabilityTypeSelector = () => (
    <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6 mb-6">
      <h3 className="text-xl font-bold text-ghibli-dark-blue font-sans mb-4">Availability Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(AVAILABILITY_TYPES).map((type) => (
          <button
            key={type}
            onClick={() => handleAvailabilityTypeChange(type)}
            className={`cursor-pointer p-4 rounded-lg border-2 text-left transition-all ${
              availabilityType === type
                ? 'border-ghibli-teal bg-ghibli-teal bg-opacity-10'
                : 'border-ghibli-brown-light hover:border-ghibli-teal'
            }`}
          >
            <div className="font-medium text-ghibli-dark-blue mb-1">
              {type === 'recurring_weekly' && 'Weekly Schedule'}
              {type === 'specific_dates' && 'Specific Dates'}
              {type === 'date_range' && 'Date Range'}
              {type === 'always_available' && 'Always Available'}
            </div>
            <div className="text-sm text-ghibli-brown">
              {type === 'recurring_weekly' && 'Same schedule each week'}
              {type === 'specific_dates' && 'Individual dates only'}
              {type === 'date_range' && 'Available during a period'}
              {type === 'always_available' && 'Flexible availability'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderRecurringWeeklyForm = () => (
    <div className="space-y-4">
      {daysOfWeek.map(({ key, label }) => {
        const daySchedule = formData.recurringSchedule?.find(s => s.dayOfWeek === key);
        const isEnabled = !!daySchedule;

        return (
          <div key={key} className="flex items-center space-x-4 p-4 bg-ghibli-cream-lightest rounded-lg">
            <div className="w-24">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => {
                    if (e.target.checked) {
                      const newSchedule = [
                        ...(formData.recurringSchedule || []),
                        { dayOfWeek: key, timeSlots: [{ startTime: "09:00", endTime: "17:00" }] }
                      ];
                      updateFormData({ recurringSchedule: newSchedule });
                    } else {
                      const newSchedule = (formData.recurringSchedule || []).filter(s => s.dayOfWeek !== key);
                      updateFormData({ recurringSchedule: newSchedule });
                    }
                  }}
                  className="w-4 h-4 text-ghibli-teal bg-gray-100 border-gray-300 rounded focus:ring-ghibli-teal"
                />
                <span className="ml-2 text-sm font-medium text-ghibli-dark-blue">{label}</span>
              </label>
            </div>

            {isEnabled && (
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-4 w-4 text-ghibli-teal" />
                  <input
                    type="time"
                    value={daySchedule.timeSlots[0]?.startTime || "09:00"}
                    onChange={(e) => {
                      const newSchedule = formData.recurringSchedule.map(s =>
                        s.dayOfWeek === key
                          ? { ...s, timeSlots: [{ ...s.timeSlots[0], startTime: e.target.value }] }
                          : s
                      );
                      updateFormData({ recurringSchedule: newSchedule });
                    }}
                    className="px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                  />
                </div>
                <span className="text-ghibli-brown">to</span>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-4 w-4 text-ghibli-teal" />
                  <input
                    type="time"
                    value={daySchedule.timeSlots[0]?.endTime || "17:00"}
                    onChange={(e) => {
                      const newSchedule = formData.recurringSchedule.map(s =>
                        s.dayOfWeek === key
                          ? { ...s, timeSlots: [{ ...s.timeSlots[0], endTime: e.target.value }] }
                          : s
                      );
                      updateFormData({ recurringSchedule: newSchedule });
                    }}
                    className="px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderSpecificDatesForm = () => (
    <div className="space-y-4">
      {formData.specificDates?.map((dateEntry, index) => (
        <div key={index} className="p-4 border border-ghibli-brown-light rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">Date</label>
              <input
                type="date"
                value={dateEntry.date}
                onChange={(e) => {
                  const newDates = [...formData.specificDates];
                  newDates[index] = { ...newDates[index], date: e.target.value };
                  updateFormData({ specificDates: newDates });
                }}
                className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">Start Time</label>
              <input
                type="time"
                value={dateEntry.timeSlots[0]?.startTime || "10:00"}
                onChange={(e) => {
                  const newDates = [...formData.specificDates];
                  newDates[index] = {
                    ...newDates[index],
                    timeSlots: [{ ...newDates[index].timeSlots[0], startTime: e.target.value }]
                  };
                  updateFormData({ specificDates: newDates });
                }}
                className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">End Time</label>
              <input
                type="time"
                value={dateEntry.timeSlots[0]?.endTime || "14:00"}
                onChange={(e) => {
                  const newDates = [...formData.specificDates];
                  newDates[index] = {
                    ...newDates[index],
                    timeSlots: [{ ...newDates[index].timeSlots[0], endTime: e.target.value }]
                  };
                  updateFormData({ specificDates: newDates });
                }}
                className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <button
              onClick={() => {
                const newDates = formData.specificDates.filter((_, i) => i !== index);
                updateFormData({ specificDates: newDates });
              }}
              className="cursor-pointer p-2 text-ghibli-red hover:bg-ghibli-red hover:text-white rounded-lg transition-colors"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={() => {
          const newDate = {
            date: '',
            timeSlots: [{ startTime: "10:00", endTime: "14:00" }]
          };
          updateFormData({
            specificDates: [...(formData.specificDates || []), newDate]
          });
        }}
        className="cursor-pointer w-full p-4 border-2 border-dashed border-ghibli-brown-light rounded-lg text-ghibli-brown hover:border-ghibli-teal hover:text-ghibli-teal transition-colors"
      >
        <PlusIcon className="h-5 w-5 mx-auto mb-2" />
        Add Date
      </button>
    </div>
  );

  const renderDateRangeForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">Start Date</label>
          <input
            type="date"
            value={formData.dateRange?.startDate || ''}
            onChange={(e) => updateFormData({
              dateRange: { ...formData.dateRange, startDate: e.target.value }
            })}
            className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">End Date</label>
          <input
            type="date"
            value={formData.dateRange?.endDate || ''}
            onChange={(e) => updateFormData({
              dateRange: { ...formData.dateRange, endDate: e.target.value }
            })}
            className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">Available Days</label>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {daysOfWeek.map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.dateRange?.daysOfWeek?.includes(key) || false}
                onChange={(e) => {
                  const currentDays = formData.dateRange?.daysOfWeek || [];
                  const newDays = e.target.checked
                    ? [...currentDays, key]
                    : currentDays.filter(d => d !== key);
                  updateFormData({
                    dateRange: { ...formData.dateRange, daysOfWeek: newDays }
                  });
                }}
                className="w-4 h-4 text-ghibli-teal bg-gray-100 border-gray-300 rounded focus:ring-ghibli-teal"
              />
              <span className="text-sm text-ghibli-dark-blue">{label.slice(0, 3)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">Start Time</label>
          <input
            type="time"
            value={formData.dateRange?.timeSlots?.[0]?.startTime || '17:00'}
            onChange={(e) => updateFormData({
              dateRange: {
                ...formData.dateRange,
                timeSlots: [{
                  ...(formData.dateRange?.timeSlots?.[0] || {}),
                  startTime: e.target.value
                }]
              }
            })}
            className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">End Time</label>
          <input
            type="time"
            value={formData.dateRange?.timeSlots?.[0]?.endTime || '20:00'}
            onChange={(e) => updateFormData({
              dateRange: {
                ...formData.dateRange,
                timeSlots: [{
                  ...(formData.dateRange?.timeSlots?.[0] || {}),
                  endTime: e.target.value
                }]
              }
            })}
            className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderAlwaysAvailableForm = () => (
    <div className="space-y-4">
      <div className="p-4 bg-ghibli-blue bg-opacity-10 rounded-lg">
        <div className="flex items-start space-x-3">
          <CheckCircleIcon className="h-5 w-5 text-ghibli-blue mt-0.5" />
          <div>
            <p className="text-sm font-medium text-white">Always Available Mode</p>
            <p className="text-xs text-white mt-1">
              You'll be available for pickups at any time. You can optionally set general time constraints below.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={!!formData.generalTimeSlots}
            onChange={(e) => {
              if (e.target.checked) {
                updateFormData({ generalTimeSlots: [{ startTime: "08:00", endTime: "22:00" }] });
              } else {
                updateFormData({ generalTimeSlots: null });
              }
            }}
            className="w-4 h-4 text-ghibli-teal bg-gray-100 border-gray-300 rounded focus:ring-ghibli-teal mr-2"
          />
          <span className="text-sm font-medium text-ghibli-dark-blue">Set general time limits</span>
        </label>

        {formData.generalTimeSlots && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">Earliest Time</label>
              <input
                type="time"
                value={formData.generalTimeSlots[0]?.startTime || '08:00'}
                onChange={(e) => updateFormData({
                  generalTimeSlots: [{
                    ...formData.generalTimeSlots[0],
                    startTime: e.target.value
                  }]
                })}
                className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">Latest Time</label>
              <input
                type="time"
                value={formData.generalTimeSlots[0]?.endTime || '22:00'}
                onChange={(e) => updateFormData({
                  generalTimeSlots: [{
                    ...formData.generalTimeSlots[0],
                    endTime: e.target.value
                  }]
                })}
                className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderScheduleTab = () => (
    <div className="space-y-6">
      {renderAvailabilityTypeSelector()}

      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <h3 className="text-xl font-bold text-ghibli-dark-blue font-sans mb-6">Schedule Configuration</h3>

        {availabilityType === AVAILABILITY_TYPES.RECURRING_WEEKLY && renderRecurringWeeklyForm()}
        {availabilityType === AVAILABILITY_TYPES.SPECIFIC_DATES && renderSpecificDatesForm()}
        {availabilityType === AVAILABILITY_TYPES.DATE_RANGE && renderDateRangeForm()}
        {availabilityType === AVAILABILITY_TYPES.ALWAYS_AVAILABLE && renderAlwaysAvailableForm()}

        {validationErrors.length > 0 && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Please fix the following errors:</p>
                <ul className="text-sm text-red-700 mt-1 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      {/* Service Area */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <h3 className="text-xl font-bold text-ghibli-dark-blue font-sans mb-4">Service Area</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
              Maximum travel distance: {formData.serviceArea?.maxRadius || 15} km
            </label>
            <input
              type="range"
              min="5"
              max="100"
              value={formData.serviceArea?.maxRadius || 15}
              onChange={(e) => updateServiceArea({ maxRadius: parseInt(e.target.value) })}
              className="w-full h-2 bg-ghibli-brown-light rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-ghibli-brown mt-1">
              <span>5 km</span>
              <span>50 km</span>
              <span>100 km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transportation Mode */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <h3 className="text-xl font-bold text-ghibli-dark-blue font-sans mb-4">Transportation</h3>
        <div>
          <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
            Transportation Mode
          </label>
          <select
            value={formData.preferences?.transportationMode || TRANSPORTATION_MODES.CAR}
            onChange={(e) => updatePreferences({ transportationMode: e.target.value })}
            className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
          >
            {Object.entries(TRANSPORTATION_MODE_NAMES).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pickup Preferences */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <h3 className="text-xl font-bold text-ghibli-dark-blue font-sans mb-4">Pickup Preferences</h3>
        <div>
          <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
            Maximum pickups per day
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={formData.preferences?.maxPickupsPerDay || 2}
            onChange={(e) => updatePreferences({ maxPickupsPerDay: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <h3 className="text-xl font-bold text-ghibli-dark-blue font-sans mb-4">Additional Notes</h3>
        <div>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => updateFormData({ notes: e.target.value })}
            placeholder="Any additional information about your availability..."
            rows={3}
            className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderUnavailableTab = () => (
    <div className="space-y-6">
      {/* Add New Unavailability */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <h3 className="text-xl font-bold text-ghibli-dark-blue font-sans mb-4">Add Unavailable Period</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">Start Date</label>
            <input
              type="date"
              value={newUnavailability.startDate}
              onChange={(e) => setNewUnavailability(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">End Date</label>
            <input
              type="date"
              value={newUnavailability.endDate}
              onChange={(e) => setNewUnavailability(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">Reason</label>
            <input
              type="text"
              value={newUnavailability.reason}
              onChange={(e) => setNewUnavailability(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Optional reason"
              className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAddUnavailability}
            disabled={isAddingUnavailability || !newUnavailability.startDate || !newUnavailability.endDate}
            className="cursor-pointer px-4 py-2 bg-ghibli-teal text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingUnavailability ? 'Adding...' : 'Add Period'}
          </button>
        </div>
      </div>

      {/* Existing Unavailability Periods */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <h3 className="text-xl font-bold text-ghibli-dark-blue font-sans mb-4">Current Unavailable Periods</h3>

        {isLoadingUnavailability ? (
          <div className="text-center py-8 text-ghibli-brown">Loading...</div>
        ) : unavailabilityPeriods.length === 0 ? (
          <div className="text-center py-8 text-ghibli-brown">
            <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No unavailable periods set</p>
          </div>
        ) : (
          <div className="space-y-3">
            {unavailabilityPeriods.map((period) => (
              <div key={period.id} className="flex items-center justify-between p-4 bg-ghibli-cream-lightest rounded-lg">
                <div>
                  <div className="font-medium text-ghibli-dark-blue">
                    {formatDateForDisplay(period.startDate)} - {formatDateForDisplay(period.endDate)}
                  </div>
                  {period.reason && (
                    <div className="text-sm text-ghibli-brown">{period.reason}</div>
                  )}
                </div>
                <button
                  onClick={() => removeUnavailability(period.id)}
                  disabled={isRemovingUnavailability}
                  className="cursor-pointer p-2 text-ghibli-red hover:bg-ghibli-red hover:text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (isLoadingAvailability) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-ghibli-blue mx-auto mb-4"></div>
          <p className="text-ghibli-brown font-medium">Loading availability settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ghibli-dark-blue handwritten">Availability Settings</h1>
          <p className="text-ghibli-brown mt-1">
            Configure when and how you want to receive pickup requests
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {myAvailability && (
            <div className="px-4 py-2 rounded-full text-sm font-medium bg-ghibli-green text-white">
              🟢 Availability Set
            </div>
          )}
          <button
            onClick={() => refetchAvailability()}
            className="cursor-pointer p-2 text-ghibli-brown hover:text-ghibli-dark-blue transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Error State */}
      {isErrorAvailability && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Failed to load availability settings</p>
              <p className="text-sm text-red-700 mt-1">Please try refreshing the page.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light">
        <div className="border-b border-ghibli-brown-light">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`cursor-pointer flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  currentTab === tab.id
                    ? 'border-ghibli-teal text-ghibli-teal'
                    : 'border-transparent text-ghibli-brown hover:text-ghibli-dark-blue'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {currentTab === 'schedule' && renderScheduleTab()}
          {currentTab === 'preferences' && renderPreferencesTab()}
          {currentTab === 'unavailable' && renderUnavailableTab()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <div>
          {myAvailability && (
            <button
              onClick={handleDeleteAvailability}
              disabled={isDeletingAvailability}
              className="cursor-pointer px-6 py-3 bg-ghibli-red text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <TrashIcon className="h-5 w-5" />
              <span>{isDeletingAvailability ? 'Deleting...' : 'Delete Availability'}</span>
            </button>
          )}
        </div>
        <button
          onClick={handleSaveAvailability}
          disabled={isSettingAvailability}
          className="cursor-pointer px-6 py-3 bg-ghibli-teal text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <CheckCircleIcon className="h-5 w-5" />
          <span>{isSettingAvailability ? 'Saving...' : 'Save Availability Settings'}</span>
        </button>
      </div>
    </div>
  );
};

export default AvailabilityView;
