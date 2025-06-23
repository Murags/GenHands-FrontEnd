import http from './httpService';

const API_ENDPOINT = '/charity/needs';

const charityNeedsService = {
  /**
   * Get the current charity's needs list.
   * @returns {Promise<Object>} The charity's needs data.
   */
  getCharityNeeds: async () => {
    const response = await http.get(API_ENDPOINT);
    // The actual data is nested in response.data.data
    return response.data ? response.data.data : null;
  },

  /**
   * Create or update a charity's needs list.
   * @param {Object} needsData - The data for the needs list.
   * @param {string[]} needsData.neededCategories - An array of category IDs.
   * @param {string} needsData.needsStatement - A statement describing the needs.
   * @returns {Promise<Object>} The updated charity needs data.
   */
  setCharityNeeds: async (needsData) => {
    const response = await http.put(API_ENDPOINT, needsData);
    return response.data;
  },

  /**
   * Clear a charity's needs list.
   * @returns {Promise<Object>} The response from the server.
   */
  clearCharityNeeds: async () => {
    const response = await http.delete(API_ENDPOINT);
    return response.data;
  },
};

export default charityNeedsService;
