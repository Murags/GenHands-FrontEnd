import React from 'react';
import { Link as RouterLink } from 'react-router-dom';


const Footer = () => (
  <footer style={{ backgroundColor: 'var(--color-ghibli-brown)', color: 'var(--color-ghibli-cream)' }} className="pt-12 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-center md:text-left">
        <div>
          <h3 className="font-serif text-xl font-semibold mb-4" style={{ color: 'var(--color-ghibli-yellow)' }}>GenHands</h3>
          <p className="text-sm font-sans">
            Making a difference, with a touch of magic. Your support helps us create positive change.
          </p>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-ghibli-yellow)' }}>Navigate</h3>
          <ul className="space-y-2 text-sm font-sans">
            <li><RouterLink to="/about" className="hover:underline" style={{ color: 'var(--color-ghibli-cream)' }}>About Us</RouterLink></li>
            <li><RouterLink to="/causes" className="hover:underline" style={{ color: 'var(--color-ghibli-cream)' }}>Causes</RouterLink></li>
            <li><RouterLink to="/how-it-works" className="hover:underline" style={{ color: 'var(--color-ghibli-cream)' }}>How It Works</RouterLink></li>
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-ghibli-yellow)' }}>Support</h3>
          <ul className="space-y-2 text-sm font-sans">
            <li><RouterLink to="/faq" className="hover:underline" style={{ color: 'var(--color-ghibli-cream)' }}>FAQ</RouterLink></li>
            <li><RouterLink to="/contact" className="hover:underline" style={{ color: 'var(--color-ghibli-cream)' }}>Contact</RouterLink></li>
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-ghibli-yellow)' }}>Legal</h3>
          <ul className="space-y-2 text-sm font-sans">
            <li><RouterLink to="/privacy" className="hover:underline" style={{ color: 'var(--color-ghibli-cream)' }}>Privacy</RouterLink></li>
            <li><RouterLink to="/terms" className="hover:underline" style={{ color: 'var(--color-ghibli-cream)' }}>Terms</RouterLink></li>
          </ul>
        </div>
      </div>
      <div className="border-t pt-8 text-center text-sm font-sans" style={{ borderColor: 'var(--color-ghibli-teal)' }}>
        <p>&copy; {new Date().getFullYear()} GenHands. Crafted with care.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
