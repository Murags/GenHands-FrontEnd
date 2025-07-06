import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArchiveBoxIcon,
  TruckIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  GiftIcon,
  SparklesIcon,
  CalendarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import KenyaImpactMap from '../../components/dashboard/KenyaImpactMap';
import CategoryAnalysisChart from '../../components/dashboard/CategoryAnalysisChart';
import MonthlyTrendsChart from '../../components/dashboard/MonthlyTrendsChart';
import { useOverviewData, useOperationalMetrics } from '../../hooks/useAdminDashboard';

const DashboardCard = ({ title, children, icon: Icon, iconBgColor = 'bg-ghibli-teal', borderColor = 'var(--color-ghibli-brown-light)', className, isLoading = false }) => (
  <div className={`bg-ghibli-cream p-5 rounded-lg shadow-ghibli flex items-start ${className}`} style={{ borderColor }}>
    {Icon && (
      <div className={`p-3 rounded-full mr-4 ${iconBgColor} bg-opacity-20`}>
        <Icon className="h-7 w-7 text-ghibli-dark-blue opacity-90" />
      </div>
    )}
    <div className="flex-1">
      <h3 className="text-lg font-semibold mb-1 text-ghibli-dark-blue font-sans">{title}</h3>
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ) : (
        <div className="text-ghibli-brown">{children}</div>
      )}
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

const TimeframeSelector = ({ timeframe, onChange }) => {
  const options = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <div className="flex items-center space-x-2">
      <CalendarIcon className="h-4 w-4 text-ghibli-brown" />
      <select
        value={timeframe}
        onChange={(e) => onChange(e.target.value)}
        className="border border-ghibli-brown-light rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ghibli-teal bg-white"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const DashboardOverviewPage = () => {
  const [timeframe, setTimeframe] = useState('30d');

  const {
    data: overviewData,
    loading: overviewLoading,
    error: overviewError,
    refetch: refetchOverview
  } = useOverviewData({ timeframe });

  const {
    data: operationalData,
    loading: operationalLoading,
    error: operationalError,
    refetch: refetchOperational
  } = useOperationalMetrics({ timeframe });

  const handleRefresh = () => {
    refetchOverview();
    refetchOperational();
  };

  const isLoading = overviewLoading || operationalLoading;
  const hasError = overviewError || operationalError;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ghibli-dark-blue text-shadow handwritten">Dashboard Overview</h1>
          <p className="text-ghibli-brown mt-2">Monitor and analyze platform performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <TimeframeSelector timeframe={timeframe} onChange={setTimeframe} />
          <button
            onClick={handleRefresh}
            className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-ghibli-teal text-white rounded-lg hover:bg-opacity-90 transition-colors"
            disabled={isLoading}
          >
            <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {hasError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">
            Error loading dashboard data: {overviewError || operationalError}
          </p>
        </div>
      )}

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <DashboardCard
          title="Total Donations"
          icon={GiftIcon}
          iconBgColor="bg-ghibli-blue"
          isLoading={isLoading}
        >
          {overviewData && (
            <>
              <p className="text-3xl font-bold text-ghibli-blue">
                {overviewData.totalDonations?.count?.toLocaleString() || 0}
              </p>
              <p className="text-xs mt-1 flex items-center">
                <span className={`text-xs ${overviewData.totalDonations?.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {overviewData.totalDonations?.growth >= 0 ? '+' : ''}{overviewData.totalDonations?.growth || 0}%
                </span>
                <span className="ml-1">vs last period</span>
              </p>
            </>
          )}
        </DashboardCard>

        <DashboardCard
          title="Active Donations"
          icon={ArchiveBoxIcon}
          iconBgColor="bg-ghibli-yellow"
          isLoading={isLoading}
        >
          {overviewData && (
            <>
              <p className="text-3xl font-bold" style={{color: 'var(--color-ghibli-orange)'}}>
                {overviewData.activeDonations?.count?.toLocaleString() || 0}
              </p>
              <p className="text-xs mt-1 flex items-center">
                <span className={`text-xs ${overviewData.activeDonations?.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {overviewData.activeDonations?.growth >= 0 ? '+' : ''}{overviewData.activeDonations?.growth || 0}%
                </span>
                <span className="ml-1">vs last period</span>
              </p>
            </>
          )}
        </DashboardCard>

        <DashboardCard
          title="Pending Pickups"
          icon={TruckIcon}
          iconBgColor="bg-ghibli-red"
          isLoading={isLoading}
        >
          {overviewData && (
            <>
              <p className="text-3xl font-bold text-ghibli-red">
                {overviewData.pendingPickups?.count?.toLocaleString() || 0}
              </p>
              <p className="text-xs mt-1">Manage Pickups</p>
            </>
          )}
        </DashboardCard>

        <DashboardCard
          title="Active Volunteers"
          icon={UsersIcon}
          iconBgColor="bg-ghibli-green"
          isLoading={isLoading}
        >
          {overviewData && (
            <>
              <p className="text-3xl font-bold text-ghibli-green">
                {overviewData.activeVolunteers?.count?.toLocaleString() || 0}
              </p>
              <p className="text-xs mt-1 flex items-center">
                <span className={`text-xs ${overviewData.activeVolunteers?.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {overviewData.activeVolunteers?.growth >= 0 ? '+' : ''}{overviewData.activeVolunteers?.growth || 0}%
                </span>
                <span className="ml-1">vs last period</span>
              </p>
            </>
          )}
        </DashboardCard>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <DashboardCard
          title="Total Users"
          icon={UsersIcon}
          iconBgColor="bg-ghibli-blue"
          isLoading={isLoading}
        >
          {overviewData && (
            <>
              <p className="text-3xl font-bold text-ghibli-blue">
                {overviewData.totalUsers?.count?.toLocaleString() || 0}
              </p>
              <p className="text-xs mt-1 flex items-center">
                <span className={`text-xs ${overviewData.totalUsers?.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {overviewData.totalUsers?.growth >= 0 ? '+' : ''}{overviewData.totalUsers?.growth || 0}%
                </span>
                <span className="ml-1">vs last period</span>
              </p>
            </>
          )}
        </DashboardCard>

        <DashboardCard
          title="Verified Charities"
          icon={SparklesIcon}
          iconBgColor="bg-ghibli-green"
          isLoading={isLoading}
        >
          {overviewData && (
            <>
              <p className="text-3xl font-bold text-ghibli-green">
                {overviewData.verifiedCharities?.count?.toLocaleString() || 0}
              </p>
              <p className="text-xs mt-1 flex items-center">
                <span className={`text-xs ${overviewData.verifiedCharities?.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {overviewData.verifiedCharities?.growth >= 0 ? '+' : ''}{overviewData.verifiedCharities?.growth || 0}%
                </span>
                <span className="ml-1">vs last period</span>
              </p>
            </>
          )}
        </DashboardCard>

        <DashboardCard
          title="Completed Donations"
          icon={SparklesIcon}
          iconBgColor="bg-ghibli-green"
          isLoading={isLoading}
        >
          {overviewData && (
            <>
              <p className="text-3xl font-bold text-ghibli-green">
                {overviewData.completedDonations?.count?.toLocaleString() || 0}
              </p>
              <p className="text-xs mt-1 flex items-center">
                <span className={`text-xs ${overviewData.completedDonations?.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {overviewData.completedDonations?.growth >= 0 ? '+' : ''}{overviewData.completedDonations?.growth || 0}%
                </span>
                <span className="ml-1">vs last period</span>
              </p>
            </>
          )}
        </DashboardCard>

        <DashboardCard
          title="Completed Pickups"
          icon={TruckIcon}
          iconBgColor="bg-ghibli-green"
          isLoading={isLoading}
        >
          {overviewData && (
            <>
              <p className="text-3xl font-bold text-ghibli-green">
                {overviewData.completedPickups?.count?.toLocaleString() || 0}
              </p>
              <p className="text-xs mt-1 flex items-center">
                <span className={`text-xs ${overviewData.completedPickups?.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {overviewData.completedPickups?.growth >= 0 ? '+' : ''}{overviewData.completedPickups?.growth || 0}%
                </span>
                <span className="ml-1">vs last period</span>
              </p>
            </>
          )}
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
          <h3 className="text-xl font-semibold mb-4 text-ghibli-dark-blue font-sans">Recent Platform Activity</h3>
          {operationalLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-3 py-2">
                  <div className="h-5 w-5 bg-gray-200 rounded"></div>
                  <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : operationalData?.recentActivities ? (
            <ul className="space-y-1">
              {operationalData.recentActivities.slice(0, 5).map((activity) => (
                <RecentActivityItem
                  key={activity.id}
                  text={activity.title}
                  time={new Date(activity.timestamp).toLocaleString()}
                  icon={activity.type === 'donation' ? GiftIcon : activity.type === 'pickup' ? TruckIcon : SparklesIcon}
                />
              ))}
            </ul>
          ) : (
            <ul className="space-y-1">
              <RecentActivityItem text="New Item: 'Vintage Armchair' listed by Sarah P." time="2m ago" icon={GiftIcon}/>
              <RecentActivityItem text="Pickup Scheduled: Volunteer Mike assigned to 'Bookshelf Collection'." time="15m ago" icon={TruckIcon}/>
              <RecentActivityItem text="Item Delivered: 'Children's Clothes Bundle' to St. Mary's Center." time="1h ago" icon={SparklesIcon}/>
              <RecentActivityItem text="New Volunteer: Alex R. completed orientation." time="3h ago" icon={UsersIcon}/>
              <RecentActivityItem text="Donation Request: 'Office Desk' by Local Youth Club." time="5h ago" icon={ClipboardDocumentListIcon}/>
            </ul>
          )}
        </div>

        <div className="bg-ghibli-cream p-5 rounded-lg shadow-ghibli" style={{ borderColor: 'var(--color-ghibli-brown-light)' }}>
          <h3 className="text-xl font-semibold mb-2 text-ghibli-dark-blue font-sans">Admin Shortcuts</h3>
          <p className="text-sm text-ghibli-brown mb-4">Quick access to common administrative tasks.</p>
          <div className="space-y-3">
            <Link to="/admin/items/categories" className="cursor-pointer btn btn-primary w-full text-sm flex items-center justify-center">
              <span>List New Item</span>
            </Link>
            <Link to="/admin/pickups/assign" className="cursor-pointer btn btn-secondary w-full text-sm flex items-center justify-center">
              <span>Assign Pending Pickup</span>
            </Link>
            <Link to="/admin/volunteers/message" className="cursor-pointer btn btn-secondary-alt w-full text-sm flex items-center justify-center hover:bg-ghibli-brown hover:text-white transition-all">
              <span>Message Volunteers</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
