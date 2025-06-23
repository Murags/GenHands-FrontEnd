import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArchiveBoxIcon,
  TruckIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  GiftIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import KenyaImpactMap from '../../components/dashboard/KenyaImpactMap';
import CategoryAnalysisChart from '../../components/dashboard/CategoryAnalysisChart';
import MonthlyTrendsChart from '../../components/dashboard/MonthlyTrendsChart';

const DashboardCard = ({ title, children, icon: Icon, iconBgColor = 'bg-ghibli-teal', borderColor = 'var(--color-ghibli-brown-light)', className }) => (
  <div className={`bg-ghibli-cream p-5 rounded-lg shadow-ghibli flex items-start ${className}`} style={{ borderColor }}>
    {Icon && (
      <div className={`p-3 rounded-full mr-4 ${iconBgColor} bg-opacity-20`}>
        <Icon className="h-7 w-7 text-ghibli-dark-blue opacity-90" />
      </div>
    )}
    <div>
      <h3 className="text-lg font-semibold mb-1 text-ghibli-dark-blue handwritten">{title}</h3>
      <div className="text-ghibli-brown">{children}</div>
    </div>
  </div>
);

const RecentActivityItem = ({ text, time, icon: Icon }) => (
  <li className="flex items-center space-x-3 py-2 border-b border-ghibli-brown-light last:border-b-0">
    {Icon && <Icon className="h-5 w-5 text-ghibli-teal flex-shrink-0" />}
    <span className="text-sm text-ghibli-brown flex-grow">{text}</span>
    {time && <span className="text-xs text-ghibli-brown-light whitespace-nowrap">{time}</span>}
  </li>
);

const DashboardOverviewPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-ghibli-dark-blue text-shadow handwritten">Dashboard Overview</h1>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <DashboardCard title="Active Item Listings" icon={ArchiveBoxIcon} iconBgColor="bg-ghibli-blue">
          <p className="text-3xl font-bold text-ghibli-blue">128</p>
          <p className="text-xs mt-1">View All Listings</p>
        </DashboardCard>

        <DashboardCard title="Pending Pickups" icon={TruckIcon} iconBgColor="bg-ghibli-red">
          <p className="text-3xl font-bold text-ghibli-red">15</p>
          <p className="text-xs mt-1">Manage Pickups</p>
        </DashboardCard>

        <DashboardCard title="Pending Deliveries" icon={TruckIcon} iconBgColor="bg-ghibli-yellow" className="">
          <p className="text-3xl font-bold" style={{color: 'var(--color-ghibli-orange)'}}>22</p>
          <p className="text-xs mt-1">Coordinate Deliveries</p>
        </DashboardCard>

        <DashboardCard title="Active Volunteers" icon={UsersIcon} iconBgColor="bg-ghibli-green">
          <p className="text-3xl font-bold text-ghibli-green">34</p>
          <p className="text-xs mt-1">View Volunteer Roster</p>
        </DashboardCard>
      </div>

      {/* Kenya Impact Map */}
      <div className="mb-8">
        <KenyaImpactMap />
      </div>

      {/* Category Analysis Chart */}
      <div className="mb-8">
        <CategoryAnalysisChart />
      </div>

      {/* Monthly Trends Chart */}
      <div className="mb-8">
        <MonthlyTrendsChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-ghibli-cream p-5 rounded-lg shadow-ghibli" style={{ borderColor: 'var(--color-ghibli-brown-light)' }}>
          <h3 className="text-xl font-semibold mb-4 text-ghibli-dark-blue handwritten">Recent Platform Activity</h3>
          <ul className="space-y-1">
            <RecentActivityItem text="New Item: 'Vintage Armchair' listed by Sarah P." time="2m ago" icon={GiftIcon}/>
            <RecentActivityItem text="Pickup Scheduled: Volunteer Mike assigned to 'Bookshelf Collection'." time="15m ago" icon={TruckIcon}/>
            <RecentActivityItem text="Item Delivered: 'Children's Clothes Bundle' to St. Mary's Center." time="1h ago" icon={SparklesIcon}/>
            <RecentActivityItem text="New Volunteer: Alex R. completed orientation." time="3h ago" icon={UsersIcon}/>
            <RecentActivityItem text="Donation Request: 'Office Desk' by Local Youth Club." time="5h ago" icon={ClipboardDocumentListIcon}/>
          </ul>
        </div>

        <div className="bg-ghibli-cream p-5 rounded-lg shadow-ghibli" style={{ borderColor: 'var(--color-ghibli-brown-light)' }}>
          <h3 className="text-xl font-semibold mb-2 text-ghibli-dark-blue handwritten">Admin Shortcuts</h3>
          <p className="text-sm text-ghibli-brown mb-4">Quick access to common administrative tasks.</p>
          <div className="space-y-3">
            <Link to="/admin/items/new" className="btn btn-primary w-full text-sm flex items-center justify-center">
              <span>List New Item</span>
            </Link>
            <Link to="/admin/pickups/assign" className="btn btn-secondary w-full text-sm flex items-center justify-center">
              <span>Assign Pending Pickup</span>
            </Link>
            <Link to="/admin/volunteers/message" className="btn btn-secondary-alt w-full text-sm flex items-center justify-center">
              <span>Message Volunteers</span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardOverviewPage;
