import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useDonationTrends } from '../../hooks/useAdminDashboard';

const DonationTrendsChart = ({ timeframe = '30d' }) => {
  const areaChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const areaChartInstance = useRef(null);
  const pieChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  const { data, loading, error } = useDonationTrends({ timeframe });

  useEffect(() => {
    if (data) {
      // Donations Over Time Area Chart
      if (areaChartRef.current && data.donationsOverTime && data.donationsOverTime.length > 0) {
        if (!areaChartInstance.current) {
          areaChartInstance.current = echarts.init(areaChartRef.current);
        }

        const areaOption = {
          title: {
            text: 'Donations Over Time',
            left: 'center',
            textStyle: {
              color: '#2c3e50',
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: data.donationsOverTime.map(item => item._id)
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: 'Donations',
              type: 'line',
              areaStyle: {
                opacity: 0.3
              },
              data: data.donationsOverTime.map(item => item.count),
              itemStyle: {
                color: '#3b82f6'
              }
            }
          ]
        };

        areaChartInstance.current.setOption(areaOption);
      }

      // Donation Status Pie Chart
      if (pieChartRef.current && data.donationsByStatus && data.donationsByStatus.length > 0) {
        if (!pieChartInstance.current) {
          pieChartInstance.current = echarts.init(pieChartRef.current);
        }

        const pieData = data.donationsByStatus.map(item => ({
          name: item._id,
          value: item.count
        }));

        const pieOption = {
          title: {
            text: 'Donation Status',
            left: 'center',
            textStyle: {
              color: '#2c3e50',
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            top: 'middle'
          },
          series: [
            {
              name: 'Status',
              type: 'pie',
              radius: '60%',
              center: ['60%', '50%'],
              data: pieData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };

        pieChartInstance.current.setOption(pieOption);
      }

      // Donations by Category Bar Chart
      if (barChartRef.current && data.donationsByCategory && data.donationsByCategory.length > 0) {
        if (!barChartInstance.current) {
          barChartInstance.current = echarts.init(barChartRef.current);
        }

        const barOption = {
          title: {
            text: 'Donations by Category',
            left: 'center',
            textStyle: {
              color: '#2c3e50',
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: data.donationsByCategory.map(item => item._id),
            axisLabel: {
              rotate: -45,
              fontSize: 10
            }
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: 'Donations',
              type: 'bar',
              data: data.donationsByCategory.map(item => item.count),
              itemStyle: {
                color: '#22c55e'
              }
            }
          ]
        };

        barChartInstance.current.setOption(barOption);
      }

      // Handle resize
      const handleResize = () => {
        areaChartInstance.current?.resize();
        pieChartInstance.current?.resize();
        barChartInstance.current?.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [data]);

  useEffect(() => {
    return () => {
      if (areaChartInstance.current) {
        areaChartInstance.current.dispose();
      }
      if (pieChartInstance.current) {
        pieChartInstance.current.dispose();
      }
      if (barChartInstance.current) {
        barChartInstance.current.dispose();
      }
    };
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-ghibli-cream p-6 rounded-lg shadow-ghibli border border-ghibli-brown-light">
          <div className="animate-pulse bg-gray-200 h-80 rounded-lg flex items-center justify-center">
            <span className="text-ghibli-brown">Loading chart...</span>
          </div>
        </div>
      ))}
    </div>
  );

  if (error) return (
    <div className="bg-ghibli-cream p-6 rounded-lg shadow-ghibli border border-ghibli-brown-light">
      <div className="text-ghibli-red">Error loading trends: {error}</div>
    </div>
  );

  if (!data) return (
    <div className="bg-ghibli-cream p-6 rounded-lg shadow-ghibli border border-ghibli-brown-light">
      <div className="text-ghibli-brown">No data available</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-ghibli-cream p-6 rounded-lg shadow-ghibli border border-ghibli-brown-light text-center">
          <div className="text-3xl font-bold text-ghibli-blue">
            {data.donationsOverTime?.reduce((sum, item) => sum + item.count, 0)?.toLocaleString() || 0}
          </div>
          <div className="text-ghibli-brown">Total Donations</div>
        </div>
        <div className="bg-ghibli-cream p-6 rounded-lg shadow-ghibli border border-ghibli-brown-light text-center">
          <div className="text-3xl font-bold text-ghibli-green">{data.avgDeliveryTime || 0}h</div>
          <div className="text-ghibli-brown">Avg Delivery Time</div>
        </div>
        <div className="bg-ghibli-cream p-6 rounded-lg shadow-ghibli border border-ghibli-brown-light text-center">
          <div className="text-3xl font-bold text-ghibli-purple">
            {data.donationsByCategory?.length || 0}
          </div>
          <div className="text-ghibli-brown">Active Categories</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donations Over Time */}
        <div className="bg-ghibli-cream p-6 rounded-lg shadow-ghibli border border-ghibli-brown-light">
          <h3 className="text-xl font-semibold mb-4 text-ghibli-dark-blue font-sans">Donations Over Time</h3>
          {data.donationsOverTime && data.donationsOverTime.length > 0 ? (
            <div ref={areaChartRef} style={{ width: '100%', height: '300px' }} />
          ) : (
            <div className="h-80 flex items-center justify-center text-ghibli-brown">
              No donation timeline data available
            </div>
          )}
        </div>

        {/* Donation Status Breakdown */}
        <div className="bg-ghibli-cream p-6 rounded-lg shadow-ghibli border border-ghibli-brown-light">
          <h3 className="text-xl font-semibold mb-4 text-ghibli-dark-blue font-sans">Donation Status</h3>
          {data.donationsByStatus && data.donationsByStatus.length > 0 ? (
            <div ref={pieChartRef} style={{ width: '100%', height: '300px' }} />
          ) : (
            <div className="h-80 flex items-center justify-center text-ghibli-brown">
              No donation status data available
            </div>
          )}
        </div>

        {/* Donations by Category */}
        <div className="bg-ghibli-cream p-6 rounded-lg shadow-ghibli border border-ghibli-brown-light">
          <h3 className="text-xl font-semibold mb-4 text-ghibli-dark-blue font-sans">Donations by Category</h3>
          {data.donationsByCategory && data.donationsByCategory.length > 0 ? (
            <div ref={barChartRef} style={{ width: '100%', height: '300px' }} />
          ) : (
            <div className="h-80 flex items-center justify-center text-ghibli-brown">
              No category data available
            </div>
          )}
        </div>

        {/* Top Performers */}
        <div className="bg-ghibli-cream p-6 rounded-lg shadow-ghibli border border-ghibli-brown-light">
          <h3 className="text-xl font-semibold mb-4 text-ghibli-dark-blue font-sans">Top Performers</h3>
          <div className="space-y-4">
            {data.topCharities && data.topCharities.length > 0 && (
              <div>
                <h4 className="font-medium text-ghibli-brown mb-2">Top Charities</h4>
                {data.topCharities.slice(0, 5).map((charity, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-ghibli-brown-light last:border-b-0">
                    <span className="text-sm text-ghibli-dark-blue">{charity.charityName}</span>
                    <span className="font-medium text-ghibli-blue">{charity.donationCount}</span>
                  </div>
                ))}
              </div>
            )}
            {data.topDonors && data.topDonors.length > 0 && (
              <div>
                <h4 className="font-medium text-ghibli-brown mb-2">Top Donors</h4>
                {data.topDonors.slice(0, 5).map((donor, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-ghibli-brown-light last:border-b-0">
                    <span className="text-sm text-ghibli-dark-blue">{donor.donorName}</span>
                    <span className="font-medium text-ghibli-green">{donor.donationCount}</span>
                  </div>
                ))}
              </div>
            )}
            {(!data.topCharities || data.topCharities.length === 0) && (!data.topDonors || data.topDonors.length === 0) && (
              <div className="h-60 flex items-center justify-center text-ghibli-brown">
                No top performer data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationTrendsChart;
