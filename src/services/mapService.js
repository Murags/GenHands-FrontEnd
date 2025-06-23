import http from './httpService';

const sampleMapData = {
  charities: [
    { name: "NAIROBI", value: 45 },
    { name: "MOMBASA", value: 12 },
    { name: "KISUMU", value: 8 },
    { name: "NAKURU", value: 6 },
    { name: "ELDORET", value: 5 },
    { name: "MACHAKOS", value: 4 },
    { name: "MERU", value: 3 },
    { name: "KIAMBU", value: 7 },
    { name: "KAKAMEGA", value: 4 },
    { name: "KILIFI", value: 3 },
    { name: "UASIN GISHU", value: 2 },
    { name: "BUNGOMA", value: 2 },
    { name: "NYERI", value: 3 }
  ],
  donors: [
    { name: "NAIROBI", value: 1250 },
    { name: "MOMBASA", value: 320 },
    { name: "KISUMU", value: 180 },
    { name: "NAKURU", value: 145 },
    { name: "ELDORET", value: 98 },
    { name: "MACHAKOS", value: 75 },
    { name: "MERU", value: 62 },
    { name: "KIAMBU", value: 189 },
    { name: "KAKAMEGA", value: 87 },
    { name: "KILIFI", value: 54 },
    { name: "UASIN GISHU", value: 45 },
    { name: "BUNGOMA", value: 38 },
    { name: "NYERI", value: 67 }
  ],
  donations: [
    { name: "NAIROBI", value: 2500000 },
    { name: "MOMBASA", value: 650000 },
    { name: "KISUMU", value: 420000 },
    { name: "NAKURU", value: 380000 },
    { name: "ELDORET", value: 290000 },
    { name: "MACHAKOS", value: 180000 },
    { name: "MERU", value: 150000 },
    { name: "KIAMBU", value: 340000 },
    { name: "KAKAMEGA", value: 210000 },
    { name: "KILIFI", value: 125000 },
    { name: "UASIN GISHU", value: 95000 },
    { name: "BUNGOMA", value: 78000 },
    { name: "NYERI", value: 145000 }
  ]
};

const getCharitiesByCounty = async () => {
  // TODO: Replace with actual API call

  await new Promise(resolve => setTimeout(resolve, 500));
  return sampleMapData.charities;
};

// Get donors by county
const getDonorsByCounty = async () => {
  // TODO: Replace with actual API call

  await new Promise(resolve => setTimeout(resolve, 500));
  return sampleMapData.donors;
};

// Get donations by county
const getDonationsByCounty = async () => {
  // TODO: Replace with actual API call

  await new Promise(resolve => setTimeout(resolve, 500));
  return sampleMapData.donations;
};

// Get all map data at once
const getMapData = async (type = 'charities') => {
  switch (type) {
    case 'charities':
      return getCharitiesByCounty();
    case 'donors':
      return getDonorsByCounty();
    case 'donations':
      return getDonationsByCounty();
    default:
      return getCharitiesByCounty();
  }
};

// Get dashboard summary stats
const getDashboardStats = async () => {
  // TODO: Replace with actual API call

  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    totalCharities: sampleMapData.charities.reduce((sum, county) => sum + county.value, 0),
    totalDonors: sampleMapData.donors.reduce((sum, county) => sum + county.value, 0),
    totalDonations: sampleMapData.donations.reduce((sum, county) => sum + county.value, 0),
    topCounty: 'NAIROBI',
    growthRate: 12.5
  };
};

export {
  getCharitiesByCounty,
  getDonorsByCounty,
  getDonationsByCounty,
  getMapData,
  getDashboardStats
};
