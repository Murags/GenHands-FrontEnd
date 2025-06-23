import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  UserIcon,
  CheckCircleIcon,
  TruckIcon,
  CalendarIcon,
  BellIcon,
  CogIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks/useAuth';

const Sidebar = ({
  volunteerStats,
  isAvailable,
  onAvailabilityToggle,
  notifications,
  activePickups = [],
  onSectionChange,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [volunteerInfo, setVolunteerInfo] = useState({ name: '', email: '' });
  const { logout, getVolunteerInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const volunteer = getVolunteerInfo();
    if (volunteer) {
      setVolunteerInfo(volunteer);
    }
  }, [getVolunteerInfo]);

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { id: 'active', label: 'Active Pickups', icon: TruckIcon, badge: activePickups.length },
    { id: 'availability', label: 'Availability', icon: CalendarIcon },
    { id: 'history', label: 'My History', icon: ClipboardDocumentListIcon },
    { id: 'settings', label: 'Settings', icon: CogIcon }
  ];

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  return (
    <div className={`fixed left-0 top-0 bg-ghibli-cream border-r shadow-ghibli h-screen overflow-y-auto overflow-x-hidden z-10 transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-80'
    }`} style={{ borderColor: 'var(--color-ghibli-brown-light)' }}>

      {/* Collapse Toggle Button */}
      <div className="absolute -right-3 top-6 z-20">
        <button
          onClick={onToggleCollapse}
          className="w-6 h-6 bg-ghibli-teal text-white rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-90 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Profile Section */}
      <div className={`border-b ${isCollapsed ? 'p-4' : 'p-6'}`} style={{ borderColor: 'var(--color-ghibli-brown-light)' }}>
        {isCollapsed ? (
          // Collapsed Profile
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-ghibli-teal rounded-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            {/* Collapsed Availability Toggle */}
            <button
              onClick={onAvailabilityToggle}
              className={`w-8 h-4 rounded-full transition-colors ${
                isAvailable ? 'bg-ghibli-green' : 'bg-ghibli-brown-light'
              }`}
              title={isAvailable ? 'Available for pickups' : 'Unavailable'}
            >
              <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                isAvailable ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        ) : (
          // Expanded Profile
          <>
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-ghibli-teal rounded-full flex items-center justify-center flex-shrink-0">
                <UserIcon className="h-7 w-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-ghibli-dark-blue handwritten truncate">
                  {volunteerInfo.name || 'Volunteer'}
                </h2>
                <p className="text-sm text-ghibli-brown truncate">
                  {volunteerInfo.email || ''}
                </p>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="mt-4 p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ghibli-dark-blue truncate mr-2">Available for Pickups</span>
                <button
                  onClick={onAvailabilityToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
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
              <p className="text-xs text-ghibli-brown mt-1 leading-tight">
                {isAvailable ? 'You\'ll receive new pickup requests' : 'You won\'t receive new requests'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Navigation Menu */}
      <div className={`${isCollapsed ? 'p-2' : 'p-6'}`}>
        {!isCollapsed && (
          <h3 className="text-lg font-semibold text-ghibli-dark-blue mb-4 handwritten">Menu</h3>
        )}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionChange(item.id)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-3'} rounded-lg transition-all relative ${
                activeSection === item.id
                  ? 'bg-ghibli-teal text-white shadow-sm'
                  : 'text-ghibli-brown hover:bg-white hover:shadow-sm'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3 min-w-0 flex-1'}`}>
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium truncate">{item.label}</span>}
              </div>
              {!isCollapsed && item.badge > 0 && (
                <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                  activeSection === item.id
                    ? 'bg-white text-ghibli-teal'
                    : 'bg-ghibli-red text-white'
                }`}>
                  {item.badge}
                </span>
              )}
              {isCollapsed && item.badge > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-ghibli-red text-white text-xs rounded-full flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </div>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className={`absolute bottom-0 w-full ${isCollapsed ? 'p-2' : 'p-6'}`}>
          <button
              onClick={handleLogout}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-3'} rounded-lg transition-all text-ghibli-brown hover:bg-ghibli-red-light hover:shadow-sm`}
              title={isCollapsed ? 'Logout' : ''}
            >
              <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3 min-w-0 flex-1'}`}>
                <ArrowRightStartOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium truncate">Logout</span>}
              </div>
            </button>
      </div>

      {/* Collapsed Menu Button - show when collapsed */}
      {isCollapsed && (
        <div className="p-4 border-t" style={{ borderColor: 'var(--color-ghibli-brown-light)' }}>
          <button
            onClick={onToggleCollapse}
            className="w-full p-3 bg-ghibli-teal text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center"
            title="Expand sidebar"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
