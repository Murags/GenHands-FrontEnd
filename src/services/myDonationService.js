import httpService from './httpService';

const myDonationsApiEndpoint = '/donations/my-donations';

export const getMyDonations = async () => {
  try {
    const response = await httpService.get(myDonationsApiEndpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching donations:', error);

    throw error;
  }
};
