import httpService from './httpService';

const API_BASE_URL = '/admin/reports';

export const adminReportsService = {
  /**
   * Download a report in the specified format
   * @param {string} reportType - Type of report (donation-overview, user-activity, charity-performance, volunteer-efficiency)
   * @param {Object} options - Download options
   * @param {string} options.format - Export format ('csv' or 'json')
   * @param {string} options.period - Time period ('7d', '30d', '90d', '1y', 'all')
   * @param {string} options.startDate - Custom start date (YYYY-MM-DD)
   * @param {string} options.endDate - Custom end date (YYYY-MM-DD)
   * @returns {Promise<Blob>} The downloaded file as a blob
   */
  downloadReport: async (reportType, options = {}) => {
    try {
      const {
        format = 'csv',
        period = '30d',
        startDate,
        endDate
      } = options;

      // Build query parameters
      const params = new URLSearchParams({
        format,
        ...(startDate && endDate ? { startDate, endDate } : { period })
      });

      const response = await httpService.get(
        `${API_BASE_URL}/export/${reportType}?${params}`,
        {
          responseType: 'blob',
          headers: {
            'Accept': format === 'csv' ? 'text/csv' : 'application/json'
          }
        }
      );

      return {
        blob: response.data,
        filename: adminReportsService.getFilename(response, reportType, format)
      };
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  },

  /**
   * Extract filename from response headers or generate default
   * @param {Object} response - Axios response object
   * @param {string} reportType - Type of report
   * @param {string} format - File format
   * @returns {string} Filename for the download
   */
  getFilename: (response, reportType, format) => {
    // Try to get filename from Content-Disposition header
    const contentDisposition = response.headers?.['content-disposition'];
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        return filenameMatch[1].replace(/['"]/g, '');
      }
    }

    // Generate default filename
    const today = new Date().toISOString().split('T')[0];
    return `${reportType}-report-${today}.${format}`;
  },

  /**
   * Trigger file download in browser
   * @param {Blob} blob - File content as blob
   * @param {string} filename - Name for the downloaded file
   */
  triggerDownload: (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Download all reports at once
   * @param {Object} options - Download options
   * @param {string} options.format - Export format ('csv' or 'json')
   * @param {string} options.period - Time period
   * @param {Function} onProgress - Progress callback function
   */
  downloadAllReports: async (options = {}, onProgress = null) => {
    const reportTypes = [
      'donation-overview',
      'user-activity',
      'charity-performance',
      'volunteer-efficiency'
    ];

    const results = [];

    for (let i = 0; i < reportTypes.length; i++) {
      const reportType = reportTypes[i];

      try {
        if (onProgress) {
          onProgress({
            current: i + 1,
            total: reportTypes.length,
            reportType,
            status: 'downloading'
          });
        }

        const { blob, filename } = await adminReportsService.downloadReport(reportType, options);
        adminReportsService.triggerDownload(blob, filename);

        results.push({ reportType, success: true, filename });

        // Add delay to prevent server overload
        if (i < reportTypes.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (onProgress) {
          onProgress({
            current: i + 1,
            total: reportTypes.length,
            reportType,
            status: 'completed'
          });
        }

      } catch (error) {
        console.error(`Failed to download ${reportType}:`, error);
        results.push({ reportType, success: false, error: error.message });

        if (onProgress) {
          onProgress({
            current: i + 1,
            total: reportTypes.length,
            reportType,
            status: 'error',
            error: error.message
          });
        }
      }
    }

    return results;
  }
};

export default adminReportsService;
