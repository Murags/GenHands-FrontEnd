import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  UserIcon,
  HeartIcon,
  GiftIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const DonorSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [donor, setDonor] = useState({ name: '', email: '' });

  useEffect(() => {
    const stored = localStorage.getItem('donor');
    if (stored) {
      setDonor(JSON.parse(stored));
    }
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HeartIcon, to: '/donor' },
    { id: 'my-donations', label: 'My Donations', icon: GiftIcon, to: '/donor/my-donations' },
    { id: 'profile', label: 'Profile', icon: UserIcon, to: '/donor/profile' },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon, to: '/donor/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('donor');
    toast.success('Logged out successfully!');
    navigate('/');
  };

  return (
    <aside
      className={`sticky top-0 left-0 h-screen z-30 transition-all duration-300 bg-gradient-to-b from-indigo-200 via-white to-indigo-100 shadow-2xl font-sans
        ${isCollapsed ? 'w-20' : 'w-72'} flex flex-col`}
      style={{ minWidth: isCollapsed ? '5rem' : '18rem' }}
    >
      {/* Collapse Toggle */}
      <div className="flex justify-end items-center h-16 px-2">
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow hover:bg-indigo-800 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Profile Section */}
      <div className={`border-b border-indigo-100 ${isCollapsed ? 'p-4' : 'p-6'}`}>
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
            <UserIcon className="h-7 w-7 text-white" />
          </div>
          {!isCollapsed && (
            <>
              <span className="text-lg font-bold text-black mb-1">{donor.name || 'Donor'}</span>
              <span className="text-xs text-gray-500 mb-2">{donor.email || ''}</span>
            </>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={`${isCollapsed ? 'p-2' : 'p-6'} flex flex-col gap-2 flex-1`}>
        {!isCollapsed && (
          <h3 className="text-lg font-bold font-sans text-center text-black mb-4 tracking-wide">Welcome!</h3>
        )}
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.id}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-base transition-all duration-200
                ${isActive
                  ? 'bg-indigo-600 text-white shadow-lg scale-105'
                  : 'text-black hover:bg-indigo-100'}
                ${isCollapsed ? 'justify-center p-3' : ''}
              `}
              style={{
                transition: 'background 0.2s, color 0.2s, transform 0.2s',
              }}
              title={isCollapsed ? item.label : ''}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className={`p-4 border-t border-indigo-100`}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-base text-indigo-700 bg-indigo-50 hover:bg-red-100 hover:text-red-600 transition-all
            ${isCollapsed ? 'justify-center p-3' : ''}
          `}
          title={isCollapsed ? 'Logout' : ''}
        >
          <ArrowRightStartOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="truncate">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default DonorSidebar;
