// Service for handling donation submissions and converting them to pickup requests

import http from './httpService';
import { cleanObject } from '../utils/objectUtils';

const API_ENDPOINT = '/donations';

/**
 * Service for handling donation-related API requests.
 */
const donationService = {
  /**
   * Submits a new donation.
   * @param {object} donationData - The data for the new donation.
   * @returns {Promise<object>} The response from the server.
   */
  submitDonation: async (donationData) => {
    const response = await http.post(API_ENDPOINT, donationData);
    return response.data;
  },

  /**
   * Fetches donations for the currently authenticated charity, with support for filtering and pagination.
   * @param {object} [filters={}] - The filtering and pagination options.
   * @param {string} [filters.status] - Filter by donation status (e.g., 'submitted', 'delivered').
   * @param {string} [filters.urgency] - Filter by urgency level (e.g., 'high', 'low').
   * @param {string} [filters.donorName] - Search for donations by donor's name.
   * @param {string} [filters.category] - Filter by a specific item category name.
   * @param {string} [filters.startDate] - The start of the date range (YYYY-MM-DD).
   * @param {string} [filters.endDate] - The end of the date range (YYYY-MM-DD).
   * @param {number} [filters.page] - The page number for pagination.
   * @param {number} [filters.limit] - The number of items per page.
   * @returns {Promise<{success: boolean, count: number, total: number, pages: number, data: Array<object>}>} The API response.
   */
  getCharityDonations: async (filters = {}) => {
    // Clean the filters object to remove any undefined or null values
    const queryParams = new URLSearchParams(cleanObject(filters)).toString();
    const response = await http.get(`${API_ENDPOINT}/charity?${queryParams}`);
    return response.data;
  },

  /**
   * Confirms a donation delivery and sends a thank you note to the donor.
   * @param {string} donationId - The ID of the donation to confirm.
   * @param {string} thankYouNote - The personalized thank you message for the donor.
   * @returns {Promise<object>} The response from the server.
   */
  confirmDonation: async (donationId, thankYouNote) => {
    const response = await http.post(`${API_ENDPOINT}/${donationId}/confirm`, {
      thankYouNote,
    });
    return response.data;
  },
};

export default donationService;
