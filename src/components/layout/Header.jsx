import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Header = () => (
  <header className="sticky top-0 z-50 shadow-ghibli" style={{ backgroundColor: 'var(--color-ghibli-cream)' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        <div className="flex items-center">
          <RouterLink to="/" className="flex items-center">
            <span className="font-serif text-3xl font-bold" style={{ color: 'var(--color-ghibli-dark-blue)' }}>
              Gen<span className="handwritten text-4xl" style={{color: 'var(--color-ghibli-red)'}}>H</span>ands
            </span>
          </RouterLink>
        </div>

        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <RouterLink to="/" className="font-sans text-base lg:text-lg hover:underline" style={{ color: 'var(--color-ghibli-brown)' }}>Home</RouterLink>
          <RouterLink to="/causes" className="font-sans text-base lg:text-lg hover:underline" style={{ color: 'var(--color-ghibli-brown)' }}>Causes</RouterLink>
          <RouterLink to="/about" className="font-sans text-base lg:text-lg hover:underline" style={{ color: 'var(--color-ghibli-brown)' }}>About</RouterLink>
          <RouterLink to="/contact" className="font-sans text-base lg:text-lg hover:underline" style={{ color: 'var(--color-ghibli-brown)' }}>Contact</RouterLink>
        </nav>

        <div className="flex items-center">
          <RouterLink
            to="/auth/signin/signin"
            className="px-4"
          >
            Login
          </RouterLink>

          <RouterLink
            to="/auth/select"
            className="btn btn-primary text-base lg:text-lg py-2.5 px-7"
          >
            Sign Up
          </RouterLink>

          {/* Mobile menu button */}
          <div className="md:hidden ml-3">
            <button type="button" style={{ color: 'var(--color-ghibli-brown)' }} className="hover:opacity-75 p-1">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
