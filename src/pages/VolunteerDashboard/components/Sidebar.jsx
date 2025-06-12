import React, { useState } from 'react';
import {
  UserIcon,
  StarIcon,
  CheckCircleIcon,
  TruckIcon,
  CalendarIcon,
  BellIcon,
  CogIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({
  volunteerStats,
  isAvailable,
  onAvailabilityToggle,
  notifications,
  activePickups = [],
  onSectionChange
}) => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { id: 'active', label: 'Active Pickups', icon: TruckIcon, badge: activePickups.length },
    { id: 'availability', label: 'Availability', icon: CalendarIcon },
    { id: 'history', label: 'My History', icon: ClipboardDocumentListIcon },
    // { id: 'notifications', label: 'Notifications', icon: BellIcon, badge: notifications.length },
    { id: 'settings', label: 'Settings', icon: CogIcon }
  ];

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  return (
    <div className="fixed left-0 top-0 w-80 bg-ghibli-cream border-r shadow-ghibli h-screen overflow-y-auto z-10" style={{ borderColor: 'var(--color-ghibli-brown-light)' }}>
      {/* Profile Section */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--color-ghibli-brown-light)' }}>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-ghibli-teal rounded-full flex items-center justify-center">
            <UserIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ghibli-dark-blue handwritten">Sarah Volunteer</h2>
            <div className="flex items-center space-x-2 mt-1">
              <StarIcon className="h-4 w-4 text-ghibli-yellow" />
              <span className="text-sm font-semibold text-ghibli-dark-blue">{volunteerStats.rating}</span>
              <span className="text-xs text-ghibli-brown">Rating</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ghibli-dark-blue">Available for Pickups</span>
            <button
              onClick={onAvailabilityToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAvailable ? 'bg-ghibli-green' : 'bg-ghibli-brown-light'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAvailable ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-ghibli-brown mt-1">
            {isAvailable ? 'You\'ll receive new pickup requests' : 'You won\'t receive new requests'}
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-ghibli-dark-blue mb-4 handwritten">Menu</h3>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                activeSection === item.id
                  ? 'bg-ghibli-teal text-white shadow-sm'
                  : 'text-ghibli-brown hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeSection === item.id
                    ? 'bg-white text-ghibli-teal'
                    : 'bg-ghibli-red text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
