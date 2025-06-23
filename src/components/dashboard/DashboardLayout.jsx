import React from 'react';
import DashboardSidebar from './DashboardSidebar';

const DashboardLayout = ({ children, role }) => {
  const userRole = role || localStorage.getItem('role');

  return (
    <div className="flex h-screen bg-ghibli-cream-lightest">
      <DashboardSidebar role={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-ghibli-cream-lightest p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
