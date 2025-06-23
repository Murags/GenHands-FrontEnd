// import http from './httpService';

// Sample data for category analysis
const sampleCategoryData = [
  { category: 'Clothing', needed: 1200, donated: 890 },
  { category: 'Food Items', needed: 800, donated: 950 },
  { category: 'Electronics', needed: 300, donated: 180 },
  { category: 'Furniture', needed: 450, donated: 320 },
  { category: 'Books & Educational', needed: 600, donated: 720 },
  { category: 'Medical Supplies', needed: 200, donated: 80 },
  { category: 'Toys & Games', needed: 350, donated: 420 },
  { category: 'Kitchen Items', needed: 280, donated: 190 },
  { category: 'Blankets & Bedding', needed: 400, donated: 310 },
  { category: 'Personal Care', needed: 150, donated: 95 }
];

// Sample data for monthly trends
const sampleMonthlyData = {
  donations: [
    { month: 'Jan', value: 1200 },
    { month: 'Feb', value: 1350 },
    { month: 'Mar', value: 1100 },
    { month: 'Apr', value: 1650 },
    { month: 'May', value: 1400 },
    { month: 'Jun', value: 1800 }
  ],
  requests: [
    { month: 'Jan', value: 1500 },
    { month: 'Feb', value: 1400 },
    { month: 'Mar', value: 1600 },
    { month: 'Apr', value: 1750 },
    { month: 'May', value: 1650 },
    { month: 'Jun', value: 1900 }
  ],
  volunteers: [
    { month: 'Jan', active: 45, hours: 680 },
    { month: 'Feb', active: 52, hours: 790 },
    { month: 'Mar', active: 48, hours: 720 },
    { month: 'Apr', active: 58, hours: 920 },
    { month: 'May', active: 55, hours: 850 },
    { month: 'Jun', active: 62, hours: 980 }
  ]
};

// Sample impact metrics data
const sampleImpactData = {
  itemsDelivered: [
    { period: 'Week 1', value: 45 },
    { period: 'Week 2', value: 38 },
    { period: 'Week 3', value: 52 },
    { period: 'Week 4', value: 47 }
  ],
  peopleHelped: [
    { period: 'Week 1', value: 120 },
    { period: 'Week 2', value: 95 },
    { period: 'Week 3', value: 145 },
    { period: 'Week 4', value: 130 }
  ],
  averageDeliveryTime: [
    { period: 'Week 1', value: 2.5 },
    { period: 'Week 2', value: 3.2 },
    { period: 'Week 3', value: 2.1 },
    { period: 'Week 4', value: 2.8 }
  ]
};

// Category Analysis
const getCategoryAnalysis = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return sampleCategoryData;
};

// Monthly Trends
const getMonthlyTrends = async (type = 'donations') => {

  await new Promise(resolve => setTimeout(resolve, 600));
  return sampleMonthlyData[type] || sampleMonthlyData.donations;
};

// Volunteer Activity Analytics
const getVolunteerAnalytics = async () => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return sampleMonthlyData.volunteers;
};

// Impact Metrics
const getImpactMetrics = async (metric = 'itemsDelivered') => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return sampleImpactData[metric] || sampleImpactData.itemsDelivered;
};

// User Engagement Analytics
const getUserEngagement = async () => {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 600));
  return {
    newRegistrations: [
      { period: 'Jan', donors: 25, charities: 8, volunteers: 15 },
      { period: 'Feb', donors: 32, charities: 12, volunteers: 18 },
      { period: 'Mar', donors: 28, charities: 6, volunteers: 22 },
      { period: 'Apr', donors: 45, charities: 15, volunteers: 28 },
      { period: 'May', donors: 38, charities: 11, volunteers: 25 },
      { period: 'Jun', donors: 52, charities: 18, volunteers: 35 }
    ],
    activeUsers: [
      { period: 'Week 1', value: 245 },
      { period: 'Week 2', value: 267 },
      { period: 'Week 3', value: 289 },
      { period: 'Week 4', value: 301 }
    ]
  };
};

// Donation Flow Analytics (Geographic)
const getDonationFlow = async () => {
  // TODO: Replace with actual API call
  // const response = await http.get('/analytics/donation-flow');
  // return response.data;

  await new Promise(resolve => setTimeout(resolve, 900));
  return {
    topDonatingCounties: [
      { name: 'NAIROBI', outgoing: 1250, incoming: 320 },
      { name: 'MOMBASA', outgoing: 340, incoming: 180 },
      { name: 'KISUMU', outgoing: 220, incoming: 290 },
      { name: 'NAKURU', outgoing: 180, incoming: 145 }
    ],
    topReceivingCounties: [
      { name: 'TURKANA', outgoing: 45, incoming: 380 },
      { name: 'MARSABIT', outgoing: 12, incoming: 290 },
      { name: 'GARISSA', outgoing: 25, incoming: 245 },
      { name: 'WAJIR', outgoing: 8, incoming: 198 }
    ]
  };
};

export {
  getCategoryAnalysis,
  getMonthlyTrends,
  getVolunteerAnalytics,
  getImpactMetrics,
  getUserEngagement,
  getDonationFlow
};
