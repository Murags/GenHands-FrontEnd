import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Header = ({ transparent }) => (
  <header
    className={`antialiased fixed top-0 left-0 w-full z-50 transition-colors duration-300 shadow-ghibli ${
      transparent ? 'bg-transparent' : ''
    }`}
    style={{
      backgroundColor: transparent ? 'transparent' : 'var(--color-ghibli-cream)',
      boxShadow: transparent ? 'none' : undefined,
    }}
  >
    <div className="max-w-7xl mx-20 px-6 sm:px-8 lg:px-12 font-sans">
      <div className="flex justify-between items-center h-20">
        {/* Left: Logo and Links */}
        <div className="flex items-center flex-1 min-w-0">
          {/* Logo */}
          <RouterLink to="/" className="flex items-center mr-8 shrink-0 pb-2">
            <span
              className={`text-2xl font-serif font-bold ${
                transparent ? 'text-white' : 'text-black'
              }`}
            >
              Generous
              <span
                className="handwritten text-4xl"
                style={{ color: 'var(--color-ghibli-red)' }}
              >
                H
              </span>
              ands
            </span>
          </RouterLink>
          {/* Links */}
          <nav className={`hidden md:flex items-center space-x-6 lg:space-x-8 font-normal font-medium ${transparent ? 'text-white' : 'text-black'}`}>
            <RouterLink to="/" className="text-base lg:text-lg hover:underline">Home</RouterLink>
            <RouterLink to="/charities" className="text-base lg:text-lg hover:underline">Charities</RouterLink>
            <RouterLink to="/about" className="text-base lg:text-lg hover:underline">About</RouterLink>
            <RouterLink to="/contact" className="text-base lg:text-lg hover:underline">Contact</RouterLink>
          </nav>
        </div>
        {/* Right: Auth Buttons */}
        <div className={`flex items-center ml-4 font-sans font-normal ${transparent ? 'text-white' : 'text-black'}`}>
          <RouterLink
            to="/auth/signin"
            className="px-4"
          >
            Login
          </RouterLink>
          <RouterLink
            to="/auth/select"
            className="btn btn-primary text-base lg:text-lg py-2.5 px-7 ml-2 bg-white text-black hover:opacity-80 transition-all duration-400"
          >
            Start for free
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
