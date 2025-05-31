import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const DashboardNotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <ExclamationTriangleIcon className="w-16 h-16 mb-4 text-ghibli-red opacity-80" />
      <h1 className="text-4xl font-bold mb-3 text-ghibli-dark-blue">
        404 - Page Not Found
      </h1>
      <p className="text-lg mb-6 text-ghibli-brown max-w-md">
        Oops! The dashboard page you're looking for doesn't seem to exist or is still under construction.
      </p>
      <Link
        to="/admin"
        className="btn btn-secondary text-lg py-2 px-5"
      >
        Back to Dashboard Overview
      </Link>
    </div>
  );
};

export default DashboardNotFoundPage;
