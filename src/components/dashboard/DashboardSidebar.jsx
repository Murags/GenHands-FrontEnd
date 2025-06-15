import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';
import {
  HomeIcon,
  ArchiveBoxIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
  TruckIcon,
  ChartPieIcon,
  CogIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Squares2X2Icon,
  ClockIcon,
  TagIcon,
  UserCircleIcon,
  BuildingStorefrontIcon,
  IdentificationIcon,
  ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline';
import { FiHome, FiUsers, FiHeart, FiGrid } from 'react-icons/fi';

const initialNavigation = [
  { name: 'Overview', href: '/admin', icon: HomeIcon },
  {
    name: 'Categories',
    icon: TagIcon,
    href: '/admin/items/categories',
  },
  {
    name: 'User Management',
    icon: UsersIcon,
    children: [
      { name: 'Charities', href: '/admin/users/charities', icon: BuildingStorefrontIcon },
      { name: 'Volunteers', href: '/admin/users/volunteers', icon: IdentificationIcon },
    ]
  },
  { name: 'Donation Requests', href: '/admin/requests', icon: ClipboardDocumentCheckIcon },
  { name: 'Logistics', href: '/admin/logistics', icon: TruckIcon },
  { name: 'Reports', href: '/admin/reports', icon: ChartPieIcon },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const DashboardSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const toggleSubMenu = (itemName) => {
    if (!isCollapsed) {
      setOpenSubMenus(prev => ({ ...prev, [itemName]: !prev[itemName] }));
    }
  };

  return (
    <div
      className={classNames(
        'flex flex-col h-screen py-8 overflow-y-auto border-r transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20 px-2' : 'w-64 px-4'
      )}
      style={{ backgroundColor: 'var(--color-ghibli-cream)', borderColor: 'var(--color-ghibli-brown-light)' }}
    >
      <div className={classNames("flex items-center mb-10", isCollapsed ? "justify-center px-0" : "px-2")}>
        <svg xmlns="http://www.w3.org/2000/svg" className={classNames("h-8 w-auto stroke-current", isCollapsed ? "" : "mr-2")} fill="none" viewBox="0 0 24 24" stroke="var(--color-ghibli-dark-blue)" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.25278C12 6.25278 15.9388 4.36975 18.5 6.25278C21.0612 8.13582 21.0612 11.8642 18.5 13.7472C15.9388 15.6303 12 17.7472 12 17.7472C12 17.7472 8.06119 15.6303 5.5 13.7472C2.93881 11.8642 2.93881 8.13582 5.5 6.25278C8.06119 4.36975 12 6.25278 12 6.25278Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.7472V20.9998" />
        </svg>
        {!isCollapsed && (
          <h2 className="text-2xl font-semibold handwritten whitespace-nowrap overflow-hidden" style={{ color: 'var(--color-ghibli-dark-blue)' }}>GenHands Admin</h2>
        )}
      </div>

      <nav className="flex-grow">
        <ul className="space-y-1">
          {initialNavigation.map((item) => (
            <li key={item.name}>
              {item.children && !isCollapsed ? (
                <>
                  <button
                    onClick={() => toggleSubMenu(item.name)}
                    data-tooltip-id="sidebar-nav-tooltip"
                    data-tooltip-content={isCollapsed ? item.name : ''}
                    data-tooltip-place="right"
                    className={classNames(
                      'flex items-center w-full px-3 py-2.5 rounded-lg transition-colors duration-200 ease-in-out text-ghibli-brown hover:bg-ghibli-teal-light hover:text-ghibli-dark-blue',
                      isCollapsed ? 'justify-center' : 'justify-between',
                      item.children.some(child => window.location.pathname.startsWith(child.href)) && !openSubMenus[item.name] ? 'bg-ghibli-teal-lightest text-ghibli-dark-blue' : ''
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className={classNames('h-6 w-6 flex-shrink-0', isCollapsed ? '' : 'mr-3')} aria-hidden="true" />
                      {!isCollapsed && <span className="font-medium whitespace-nowrap overflow-hidden">{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                      openSubMenus[item.name] ?
                      <ChevronDownIcon className="h-5 w-5" /> :
                      <ChevronRightIcon className="h-5 w-5" />
                    )}
                  </button>
                  {openSubMenus[item.name] && !isCollapsed && (
                    <ul className="pl-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <NavLink
                            to={child.href}
                            className={({ isActive }) => classNames(
                              'flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-200 ease-in-out',
                              isActive ? 'bg-ghibli-teal text-ghibli-cream' : 'text-ghibli-brown hover:bg-ghibli-teal-light hover:text-ghibli-dark-blue'
                            )}
                          >
                            {child.icon && <child.icon className="h-5 w-5 mr-2.5 flex-shrink-0 opacity-80" aria-hidden="true" />}
                            <span className="whitespace-nowrap overflow-hidden">{child.name}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.href || (item.children && item.children[0]?.href) || '#'}
                  end={item.href === '/admin' && !item.children}
                  data-tooltip-id="sidebar-nav-tooltip"
                  data-tooltip-content={isCollapsed ? item.name : ''}
                  data-tooltip-place="right"
                  className={({ isActive }) =>
                    classNames(
                      'flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 ease-in-out',
                      isCollapsed ? 'justify-center' : '',
                      isActive
                        ? 'bg-ghibli-teal text-ghibli-cream shadow-sm'
                        : 'text-ghibli-brown hover:bg-ghibli-teal-light hover:text-ghibli-dark-blue'
                    )
                  }
                >
                  <item.icon className={classNames('h-6 w-6 flex-shrink-0', isCollapsed ? '' : 'mr-3')} aria-hidden="true" />
                  {!isCollapsed && <span className="font-medium whitespace-nowrap overflow-hidden">{item.name}</span>}
                  {isCollapsed && <span className="sr-only">{item.name}</span>}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-ghibli-brown-light">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-3 py-2.5 rounded-lg text-ghibli-brown hover:bg-ghibli-red-light hover:text-ghibli-dark-blue transition-colors duration-200 ease-in-out focus:outline-none mb-2"
          title="Logout"
        >
          <ArrowRightStartOnRectangleIcon className={classNames('h-6 w-6 flex-shrink-0', isCollapsed ? '' : 'mr-3')} />
          {!isCollapsed && <span className="font-medium whitespace-nowrap overflow-hidden">Logout</span>}
          <span className="sr-only">Logout</span>
        </button>
        <button
          onClick={() => {
            setIsCollapsed(!isCollapsed);
            if (!isCollapsed) setOpenSubMenus({});
          }}
          className="flex items-center justify-center w-full px-3 py-2.5 rounded-lg text-ghibli-brown hover:bg-ghibli-teal-light hover:text-ghibli-dark-blue transition-colors duration-200 ease-in-out focus:outline-none"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronDoubleRightIcon className="h-6 w-6" /> : <ChevronDoubleLeftIcon className="h-6 w-6" />}
          {!isCollapsed && <span className="ml-3 font-medium whitespace-nowrap overflow-hidden">Collapse</span>}
          <span className="sr-only">{isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}</span>
        </button>
      </div>
      <Tooltip id="sidebar-nav-tooltip" style={{ backgroundColor: "var(--color-ghibli-dark-blue)", color: "var(--color-ghibli-cream)", borderRadius: "6px", padding: "4px 8px", fontSize: "0.875rem" }} />
    </div>
  );
};

export default DashboardSidebar;
