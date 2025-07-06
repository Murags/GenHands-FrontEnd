import React, { useState } from 'react';
import {
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useAdminReports } from '../../hooks/useAdminReports';
import Modal from '../Modal';

const BulkReportDownloader = ({ className = '' }) => {
  const [period, setPeriod] = useState('30d');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const {
    downloadAllReports,
    isBulkDownloading,
    downloadProgress
  } = useAdminReports();

  const handleBulkDownload = () => {
    setShowConfirmModal(false);
    downloadAllReports({ format: 'csv', period });
  };

  const getProgressIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-ghibli-green" />;
      case 'error':
        return <XCircleIcon className="h-4 w-4 text-ghibli-red" />;
      case 'downloading':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ghibli-blue"></div>;
      default:
        return <div className="h-4 w-4 rounded-full bg-ghibli-brown-light"></div>;
    }
  };

  const formatReportName = (reportType) => {
    return reportType
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <>
      <div className={`bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-4 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-ghibli-teal rounded-lg flex items-center justify-center">
              <DocumentArrowDownIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ghibli-dark-blue font-sans">
                Bulk Download
              </h3>
              <p className="text-sm text-ghibli-brown">
                Download all 4 reports at once
              </p>
            </div>
          </div>
        </div>

        {!isBulkDownloading ? (
          <div className="flex items-center space-x-4">
            {/* Time Period Selection */}
            <div className="flex-1">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="cursor-pointer w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent bg-white text-sm"
              >
                <option value="7d">📅 Last 7 Days</option>
                <option value="30d">📅 Last 30 Days</option>
                <option value="90d">📅 Last 90 Days</option>
                <option value="1y">📅 Last Year</option>
                <option value="all">📅 All Time</option>
              </select>
            </div>

            {/* Download Button */}
            <button
              onClick={() => setShowConfirmModal(true)}
              className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-ghibli-teal text-white rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>Download All</span>
            </button>
          </div>
        ) : (
          /* Progress Display */
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-sm font-medium text-ghibli-dark-blue">
                {downloadProgress ? (
                  `Downloading ${downloadProgress.current} of ${downloadProgress.total} reports...`
                ) : (
                  'Preparing downloads...'
                )}
              </div>
            </div>

            {/* Progress List */}
            <div className="space-y-2">
              {['donation-overview', 'user-activity', 'charity-performance', 'volunteer-efficiency'].map((reportType, index) => {
                const isCurrentOrCompleted = downloadProgress && index < downloadProgress.current;
                const isCurrent = downloadProgress && index + 1 === downloadProgress.current;
                const status = isCurrent ? downloadProgress.status : (isCurrentOrCompleted ? 'completed' : 'pending');

                return (
                  <div
                    key={reportType}
                    className={`flex items-center space-x-2 p-2 rounded-lg text-sm ${
                      status === 'completed' ? 'bg-green-50 text-green-800' :
                      status === 'error' ? 'bg-red-50 text-red-800' :
                      status === 'downloading' ? 'bg-blue-50 text-blue-800' :
                      'bg-gray-50 text-gray-600'
                    }`}
                  >
                    {getProgressIcon(status)}
                    <span className="flex-1">{formatReportName(reportType)}</span>
                    <span className="text-xs">
                      {status === 'completed' && '✓'}
                      {status === 'downloading' && '⏳'}
                      {status === 'error' && '❌'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Download All Reports?"
        size="small"
      >
        <div className="space-y-4">
          <p className="text-sm text-ghibli-brown">
            This will download all 4 admin reports in CSV format for the selected time period.
          </p>

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="cursor-pointer px-4 py-2 text-ghibli-brown hover:bg-ghibli-cream-lightest rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkDownload}
              className="cursor-pointer px-4 py-2 bg-ghibli-teal text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Download All
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BulkReportDownloader;
