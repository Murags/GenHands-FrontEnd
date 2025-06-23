import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminReportsService } from '../services/adminReportsService';

export const useAdminReports = () => {
  const [downloadProgress, setDownloadProgress] = useState(null);

  // Single report download mutation
  const downloadReportMutation = useMutation({
    mutationFn: ({ reportType, options }) =>
      adminReportsService.downloadReport(reportType, options),
    onSuccess: ({ blob, filename }) => {
      adminReportsService.triggerDownload(blob, filename);
      toast.success(`Report downloaded: ${filename}`);
    },
    onError: (error) => {
      console.error('Download failed:', error);
      toast.error('Failed to download report. Please try again.');
    }
  });

  // Bulk download mutation
  const downloadAllReportsMutation = useMutation({
    mutationFn: (options) =>
      adminReportsService.downloadAllReports(options, setDownloadProgress),
    onSuccess: (results) => {
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      if (failed === 0) {
        toast.success(`All ${successful} reports downloaded successfully!`);
      } else {
        toast.error(`Downloaded ${successful} reports, ${failed} failed`);
      }

      setDownloadProgress(null);
    },
    onError: (error) => {
      console.error('Bulk download failed:', error);
      toast.error('Failed to download reports. Please try again.');
      setDownloadProgress(null);
    }
  });

  const downloadReport = (reportType, options = {}) => {
    downloadReportMutation.mutate({ reportType, options });
  };

  const downloadAllReports = (options = {}) => {
    downloadAllReportsMutation.mutate(options);
  };

  return {
    // Single report download
    downloadReport,
    isDownloading: downloadReportMutation.isPending,
    downloadError: downloadReportMutation.error,

    // Bulk download
    downloadAllReports,
    isBulkDownloading: downloadAllReportsMutation.isPending,
    bulkDownloadError: downloadAllReportsMutation.error,
    downloadProgress,

    // Utility
    isAnyDownloading: downloadReportMutation.isPending || downloadAllReportsMutation.isPending
  };
};

export default useAdminReports;
