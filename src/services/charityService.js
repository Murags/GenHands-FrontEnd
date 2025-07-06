import httpService from './httpService';

const charityApiEndpoint = 'auth/charities';

export const getCharities = async () => {
  try {
    const response = await httpService.get(charityApiEndpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching charities:', error);

    throw error;
  }
};


