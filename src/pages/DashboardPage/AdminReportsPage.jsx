import React from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';
import ReportDownloader from '../../components/admin/ReportDownloader';
import BulkReportDownloader from '../../components/admin/BulkReportDownloader';

const AdminReportsPage = () => {
  const reportConfigs = [
    {
      reportType: 'donation-overview',
      title: 'Donation Overview',
      description: 'Comprehensive donation statistics, status breakdown, and charity performance metrics',
      icon: ChartBarIcon,
      details: [
        'Total donations and confirmation rates',
        'Status breakdown (confirmed, delivered, etc.)',
        'Top performing charities',
        'Category-wise donation analysis'
      ]
    },
    {
      reportType: 'user-activity',
      title: 'User Activity Report',
      description: 'User engagement metrics, registration trends, and platform usage statistics',
      icon: UsersIcon,
      details: [
        'User registration and verification trends',
        'Role-based activity breakdown',
        'Geographic distribution of users',
        'Platform engagement metrics'
      ]
    },
    {
      reportType: 'charity-performance',
      title: 'Charity Performance',
      description: 'Individual charity metrics including response times and confirmation rates',
      icon: BuildingStorefrontIcon,
      details: [
        'Charity-wise donation counts',
        'Average response and confirmation times',
        'Performance benchmarking',
        'Verification status overview'
      ]
    },
    {
      reportType: 'volunteer-efficiency',
      title: 'Volunteer Efficiency',
      description: 'Volunteer productivity metrics, pickup success rates, and performance analysis',
      icon: TruckIcon,
      details: [
        'Volunteer pickup statistics',
        'Efficiency and success rates',
        'Geographic coverage analysis',
        'Performance trending over time'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-ghibli-blue rounded-lg flex items-center justify-center">
            <DocumentChartBarIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-ghibli-dark-blue handwritten">
              Admin Reports & Analytics
            </h1>
            <p className="text-ghibli-brown mt-1">
              Download comprehensive CSV reports for data analysis
            </p>
          </div>
        </div>
      </div>

      {/* Bulk Download Section */}
      <BulkReportDownloader />

      {/* Individual Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {reportConfigs.map((config) => (
          <div key={config.reportType} className="space-y-4">
            <ReportDownloader
              reportType={config.reportType}
              title={config.title}
              description={config.description}
              icon={config.icon}
            />

            {/* Report Details */}
            <div className="bg-ghibli-cream-lightest rounded-lg p-4 border border-ghibli-brown-light">
              <h4 className="text-sm font-medium text-ghibli-dark-blue mb-2">
                What's included in this report:
              </h4>
              <ul className="text-xs text-ghibli-brown space-y-1">
                {config.details.map((detail, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-ghibli-teal mt-1">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReportsPage;
