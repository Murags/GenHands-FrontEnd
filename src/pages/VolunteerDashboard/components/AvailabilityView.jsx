import React, { useState } from 'react';
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
  CogIcon
} from '@heroicons/react/24/outline';

const AvailabilityView = () => {
  const [currentTab, setCurrentTab] = useState('schedule');
  const [isAvailable, setIsAvailable] = useState(true);
  const [weeklySchedule, setWeeklySchedule] = useState({
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '17:00' },
    saturday: { enabled: false, start: '10:00', end: '16:00' },
    sunday: { enabled: false, start: '10:00', end: '16:00' }
  });
  const [maxDistance, setMaxDistance] = useState(15);
  const [notifications, setNotifications] = useState({
    newRequests: true,
    reminders: true,
    updates: false
  });
  const [specialDates, setSpecialDates] = useState([
    { id: 1, date: '2024-01-15', type: 'unavailable', reason: 'Personal appointment' },
    { id: 2, date: '2024-01-20', type: 'extended', start: '08:00', end: '20:00', reason: 'Extra availability' }
  ]);

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const tabs = [
    { id: 'schedule', label: 'Weekly Schedule', icon: CalendarIcon },
    { id: 'preferences', label: 'Preferences', icon: CogIcon },
    { id: 'special', label: 'Special Dates', icon: ClockIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon }
  ];

  const handleScheduleChange = (day, field, value) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const addSpecialDate = () => {
    const newDate = {
      id: Date.now(),
      date: '',
      type: 'unavailable',
      reason: ''
    };
    setSpecialDates(prev => [...prev, newDate]);
  };

  const removeSpecialDate = (id) => {
    setSpecialDates(prev => prev.filter(date => date.id !== id));
  };

  const updateSpecialDate = (id, field, value) => {
    setSpecialDates(prev => prev.map(date =>
      date.id === id ? { ...date, [field]: value } : date
    ));
  };

  const renderScheduleTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-ghibli-dark-blue handwritten">Overall Availability</h3>
            <p className="text-ghibli-brown mt-1">
              {isAvailable ? 'You are currently accepting pickup requests' : 'You are not accepting new requests'}
            </p>
          </div>
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              isAvailable ? 'bg-ghibli-green' : 'bg-ghibli-brown-light'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                isAvailable ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <h3 className="text-xl font-bold text-ghibli-dark-blue handwritten mb-6">Weekly Schedule</h3>
        <div className="space-y-4">
          {daysOfWeek.map(({ key, label }) => (
            <div key={key} className="flex items-center space-x-4 p-4 bg-ghibli-cream-lightest rounded-lg">
              <div className="w-24">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={weeklySchedule[key].enabled}
                    onChange={(e) => handleScheduleChange(key, 'enabled', e.target.checked)}
                    className="w-4 h-4 text-ghibli-teal bg-gray-100 border-gray-300 rounded focus:ring-ghibli-teal"
                  />
                  <span className="ml-2 text-sm font-medium text-ghibli-dark-blue">{label}</span>
                </label>
              </div>

              {weeklySchedule[key].enabled && (
                <div className="flex items-center space-x-3 flex-1">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-ghibli-teal" />
                    <input
                      type="time"
                      value={weeklySchedule[key].start}
                      onChange={(e) => handleScheduleChange(key, 'start', e.target.value)}
                      className="px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                    />
                  </div>
                  <span className="text-ghibli-brown">to</span>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-ghibli-teal" />
                    <input
                      type="time"
                      value={weeklySchedule[key].end}
                      onChange={(e) => handleScheduleChange(key, 'end', e.target.value)}
                      className="px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                    />
                  </div>
                  <div className="text-sm text-ghibli-brown">
                    ({Math.round((new Date(`1970-01-01T${weeklySchedule[key].end}:00`) - new Date(`1970-01-01T${weeklySchedule[key].start}:00`)) / 3600000)} hours)
                  </div>
                </div>
              )}

              {!weeklySchedule[key].enabled && (
                <div className="flex-1 text-sm text-ghibli-brown italic">
                  Not available on this day
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-ghibli-blue bg-opacity-10 rounded-lg">
          <div className="flex items-start space-x-3">
            <CheckCircleIcon className="h-5 w-5 text-ghibli-blue mt-0.5" />
            <div>
              <p className="text-sm font-medium text-ghibli-dark-blue">Quick Setup Tips</p>
              <ul className="text-xs text-ghibli-brown mt-1 space-y-1">
                <li>• Set realistic time slots when you can respond to requests</li>
                <li>• Consider travel time between your location and pickup areas</li>
                <li>• You can always adjust your schedule as needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      {/* Distance Preferences */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <h3 className="text-xl font-bold text-ghibli-dark-blue handwritten mb-4">Distance Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
              Maximum travel distance: {maxDistance} km
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseInt(e.target.value))}
              className="w-full h-2 bg-ghibli-brown-light rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-ghibli-brown mt-1">
              <span>5 km</span>
              <span>25 km</span>
              <span>50 km</span>
            </div>
          </div>
          <div className="p-3 bg-ghibli-cream-lightest rounded-lg">
            <p className="text-sm text-ghibli-brown">
              You'll receive pickup requests within <strong>{maxDistance} km</strong> of your location.
              Closer requests will be prioritized.
            </p>
          </div>
        </div>
      </div>

      {/* Response Time */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <h3 className="text-xl font-bold text-ghibli-dark-blue handwritten mb-4">Response Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
              Preferred response time
            </label>
            <select className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent">
              <option value="immediate">Immediate (within 15 minutes)</option>
              <option value="quick">Quick (within 1 hour)</option>
              <option value="flexible">Flexible (within 4 hours)</option>
              <option value="scheduled">Scheduled (next available slot)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
              Pickup types you prefer
            </label>
            <div className="space-y-2">
              {['Food donations', 'Clothing & textiles', 'Books & educational materials', 'Household items', 'Medical supplies'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-ghibli-teal bg-gray-100 border-gray-300 rounded focus:ring-ghibli-teal"
                  />
                  <span className="ml-2 text-sm text-ghibli-dark-blue">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSpecialDatesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-ghibli-dark-blue handwritten">Special Dates</h3>
          <button
            onClick={addSpecialDate}
            className="flex items-center space-x-2 px-4 py-2 bg-ghibli-teal text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Date</span>
          </button>
        </div>

        <div className="space-y-4">
          {specialDates.map((specialDate) => (
            <div key={specialDate.id} className="p-4 border border-ghibli-brown-light rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">Date</label>
                  <input
                    type="date"
                    value={specialDate.date}
                    onChange={(e) => updateSpecialDate(specialDate.id, 'date', e.target.value)}
                    className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">Type</label>
                  <select
                    value={specialDate.type}
                    onChange={(e) => updateSpecialDate(specialDate.id, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                  >
                    <option value="unavailable">Unavailable</option>
                    <option value="extended">Extended Hours</option>
                    <option value="limited">Limited Availability</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">Reason</label>
                  <input
                    type="text"
                    value={specialDate.reason}
                    onChange={(e) => updateSpecialDate(specialDate.id, 'reason', e.target.value)}
                    placeholder="Optional reason"
                    className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => removeSpecialDate(specialDate.id)}
                    className="p-2 text-ghibli-red hover:bg-ghibli-red hover:text-white rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {specialDate.type === 'extended' && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">Start Time</label>
                    <input
                      type="time"
                      value={specialDate.start || '08:00'}
                      onChange={(e) => updateSpecialDate(specialDate.id, 'start', e.target.value)}
                      className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ghibli-dark-blue mb-1">End Time</label>
                    <input
                      type="time"
                      value={specialDate.end || '20:00'}
                      onChange={(e) => updateSpecialDate(specialDate.id, 'end', e.target.value)}
                      className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg text-sm focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {specialDates.length === 0 && (
            <div className="text-center py-8 text-ghibli-brown">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No special dates configured</p>
              <p className="text-sm">Add dates when your availability differs from your regular schedule</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <h3 className="text-xl font-bold text-ghibli-dark-blue handwritten mb-6">Notification Preferences</h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-ghibli-cream-lightest rounded-lg">
              <div>
                <h4 className="font-medium text-ghibli-dark-blue">
                  {key === 'newRequests' && 'New Pickup Requests'}
                  {key === 'reminders' && 'Pickup Reminders'}
                  {key === 'updates' && 'Status Updates'}
                </h4>
                <p className="text-sm text-ghibli-brown">
                  {key === 'newRequests' && 'Get notified when new pickups are available in your area'}
                  {key === 'reminders' && 'Receive reminders about upcoming scheduled pickups'}
                  {key === 'updates' && 'Updates about pickup status changes and completions'}
                </p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-ghibli-green' : 'bg-ghibli-brown-light'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ghibli-dark-blue handwritten">Availability Settings</h1>
          <p className="text-ghibli-brown mt-1">
            Manage when and how you want to receive pickup requests
          </p>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          isAvailable
            ? 'bg-ghibli-green text-white'
            : 'bg-ghibli-brown-light text-ghibli-brown'
        }`}>
          {isAvailable ? '🟢 Available' : '🔴 Unavailable'}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light">
        <div className="border-b border-ghibli-brown-light">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
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
          {currentTab === 'special' && renderSpecialDatesTab()}
          {currentTab === 'notifications' && renderNotificationsTab()}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-ghibli-teal text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center space-x-2">
          <CheckCircleIcon className="h-5 w-5" />
          <span>Save Availability Settings</span>
        </button>
      </div>
    </div>
  );
};

export default AvailabilityView;
