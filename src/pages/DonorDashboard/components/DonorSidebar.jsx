import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  UserIcon,
  HeartIcon,
  GiftIcon,
  ChatBubbleLeftEllipsisIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks/useAuth';

const DonorSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [donor, setDonor] = useState({ name: '', email: '' });
  const { logout } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem('donor');
    if (stored) {
      setDonor(JSON.parse(stored));
    }
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HeartIcon, to: '/donor' },
    { id: 'my-donations', label: 'My Donations', icon: GiftIcon, to: '/donor/my-donations' },
    { id: 'thank-you-notes', label: 'Thank You Notes', icon: ChatBubbleLeftEllipsisIcon, to: '/donor/thank-you-notes' },
    { id: 'profile', label: 'Profile', icon: UserIcon, to: '/donor/profile' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside
      className={`sticky top-0 left-0 h-screen z-30 transition-all duration-300 bg-white shadow-ghibli border-r border-ghibli-brown-light font-sans
        ${isCollapsed ? 'w-20' : 'w-72'} flex flex-col`}
      style={{ minWidth: isCollapsed ? '5rem' : '18rem' }}
    >
      {/* Collapse Toggle */}
      <div className="flex justify-end items-center h-16 px-2">
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="w-7 h-7 bg-ghibli-teal text-white rounded-full flex items-center justify-center shadow-sm hover:bg-ghibli-dark-blue transition-colors"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Profile Section */}
      <div className={`border-b border-ghibli-brown-light ${isCollapsed ? 'p-4' : 'p-6'}`}>
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-ghibli-teal rounded-full flex items-center justify-center mb-2 shadow-sm">
            <UserIcon className="h-7 w-7 text-white" />
          </div>
          {!isCollapsed && (
            <>
              <span className="text-lg font-bold text-ghibli-dark-blue mb-1">{donor.name || 'Donor'}</span>
              <span className="text-xs text-ghibli-brown mb-2">{donor.email || ''}</span>
            </>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={`${isCollapsed ? 'p-2' : 'p-6'} flex flex-col gap-2 flex-1`}>
        {!isCollapsed && (
          <h3 className="text-lg font-bold text-center text-ghibli-dark-blue mb-4 tracking-wide handwritten">Welcome!</h3>
        )}
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.id}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-base transition-all duration-200
                ${isActive
                  ? 'bg-ghibli-teal text-white shadow-sm scale-105'
                  : 'text-ghibli-dark-blue hover:bg-ghibli-cream-lightest hover:text-ghibli-teal'}
                ${isCollapsed ? 'justify-center p-3' : ''}
              `}
              title={isCollapsed ? item.label : ''}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className={`p-4 border-t border-ghibli-brown-light`}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-base text-ghibli-red bg-ghibli-cream-lightest hover:bg-ghibli-red hover:text-white transition-all
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
