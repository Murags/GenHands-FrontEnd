import React, { useState } from 'react';
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  CalendarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useAdminReports } from '../../hooks/useAdminReports';

const ReportDownloader = ({
  reportType,
  title,
  description,
  icon: Icon = DocumentTextIcon,
  className = ''
}) => {
  const [period, setPeriod] = useState('30d');
  const [showCustomDates, setShowCustomDates] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { downloadReport, isDownloading } = useAdminReports();

  const handleDownload = () => {
    const options = {
      format: 'csv', // Always CSV
      ...(showCustomDates && startDate && endDate
        ? { startDate, endDate }
        : { period }
      )
    };

    downloadReport(reportType, options);
  };

  const isCustomDateValid = showCustomDates ? (startDate && endDate && startDate <= endDate) : true;
  const canDownload = !isDownloading && isCustomDateValid;

  return (
    <div className={`bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-ghibli-blue rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-ghibli-dark-blue handwritten">
              {title}
            </h3>
            <p className="text-sm text-ghibli-brown mt-1">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Download Controls */}
      <div className="space-y-4">
        {/* Time Period Selection */}
        <div>
          <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
            Time Period
          </label>
          <select
            value={showCustomDates ? 'custom' : period}
            onChange={(e) => {
              if (e.target.value === 'custom') {
                setShowCustomDates(true);
              } else {
                setShowCustomDates(false);
                setPeriod(e.target.value);
              }
            }}
            className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent bg-white"
          >
            <option value="7d">📅 Last 7 Days</option>
            <option value="30d">📅 Last 30 Days</option>
            <option value="90d">📅 Last 90 Days</option>
            <option value="1y">📅 Last Year</option>
            <option value="all">📅 All Time</option>
            <option value="custom">🗓️ Custom Range</option>
          </select>
        </div>

        {/* Custom Date Range */}
        {showCustomDates && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-ghibli-cream-lightest rounded-lg border border-ghibli-brown-light">
            <div>
              <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate || undefined}
                className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent bg-white"
              />
            </div>
          </div>
        )}

        {/* Download Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleDownload}
            disabled={!canDownload}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              canDownload
                ? 'bg-ghibli-teal text-white hover:bg-opacity-90 hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-ghibli-brown-light text-ghibli-brown cursor-not-allowed'
            }`}
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Download CSV</span>
              </>
            )}
          </button>
        </div>

        {/* Validation Message */}
        {showCustomDates && (!startDate || !endDate) && (
          <div className="text-xs text-ghibli-red mt-2">
            Please select both start and end dates for custom range
          </div>
        )}

        {showCustomDates && startDate && endDate && startDate > endDate && (
          <div className="text-xs text-ghibli-red mt-2">
            Start date must be before or equal to end date
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDownloader;
