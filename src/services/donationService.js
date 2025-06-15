// Service for handling donation submissions and converting them to pickup requests

import httpService from './httpService';

export const submitDonation = async (donationData) => {
  try {
    const response = await httpService.post('/donations', donationData);
    return response.data;
  } catch (error) {
    console.error('Error submitting donation:', error);
    // Re-throw the error so the component can catch it
    throw error.response?.data || error;
  }
};

export default {
  submitDonation,
};
