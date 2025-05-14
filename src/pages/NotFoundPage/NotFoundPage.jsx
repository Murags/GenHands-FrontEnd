import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6" style={{ backgroundColor: 'var(--color-ghibli-cream-light)', color: 'var(--color-ghibli-brown)' }}>
      <h1 className="text-6xl md:text-9xl font-bold text-shadow-ghibli-dark-blue" style={{ color: 'var(--color-ghibli-dark-blue)' }}>404</h1>
      <h2 className="text-2xl md:text-4xl font-semibold mt-4 mb-6 handwritten">
        Oops! Page Not Found
      </h2>
      <p className="text-lg md:text-xl mb-8 max-w-md">
        It seems the page you're looking for has wandered off into the spirit world. Don't worry, we can guide you back.
      </p>
      {/* <img src="/path-to-your-ghibli-themed-404-image.png" alt="Lost Soot Sprite" className="w-48 h-48 mb-8 opacity-80" /> */}
      <Link
        to="/"
        className="btn btn-primary text-lg py-3 px-6"
      >
        Return to Home
      </Link>
      <p className="mt-12 text-sm">
        If you believe this is an error, please <Link to="/contact" className="underline hover:text-ghibli-teal">contact us</Link>.
      </p>
    </div>
  );
}

export default NotFoundPage;
