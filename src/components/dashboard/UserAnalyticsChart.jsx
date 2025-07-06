import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useUserAnalytics } from '../../hooks/useAdminDashboard';

const UserAnalyticsChart = ({ timeframe = '30d' }) => {
  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartInstance = useRef(null);
  const lineChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  const { data, loading, error } = useUserAnalytics({ timeframe });

  useEffect(() => {
    if (data) {
      // Users by Role Pie Chart
      if (pieChartRef.current && data.usersByRole && data.usersByRole.length > 0) {
        if (!pieChartInstance.current) {
          pieChartInstance.current = echarts.init(pieChartRef.current);
        }

        const pieData = data.usersByRole.map(item => ({
          name: item._id,
          value: item.count
        }));

        const pieOption = {
          title: {
            text: 'Users by Role',
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
              name: 'Users',
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

      // Registration Trends Line Chart
      if (lineChartRef.current && data.newUsersOverTime && data.newUsersOverTime.length > 0) {
        if (!lineChartInstance.current) {
          lineChartInstance.current = echarts.init(lineChartRef.current);
        }

        // Process registration trends data
        const registrationTrendsData = data.newUsersOverTime.reduce((acc, item) => {
          const existing = acc.find(a => a.date === item._id.date);
          if (existing) {
            existing[item._id.role] = item.count;
          } else {
            acc.push({
              date: item._id.date,
              [item._id.role]: item.count
            });
          }
          return acc;
        }, []);

        const dates = registrationTrendsData.map(item => item.date);
        const roles = ['donor', 'volunteer', 'charity', 'admin'];
        const colors = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'];

        const series = roles.map((role, index) => ({
          name: role.charAt(0).toUpperCase() + role.slice(1) + 's',
          type: 'line',
          data: registrationTrendsData.map(item => item[role] || 0),
          itemStyle: {
            color: colors[index]
          }
        }));

        const lineOption = {
          title: {
            text: 'Registration Trends',
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
          legend: {
            data: series.map(s => s.name),
            top: 30
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: dates
          },
          yAxis: {
            type: 'value'
          },
          series: series
        };

        lineChartInstance.current.setOption(lineOption);
      }

      // Verification Status Bar Chart
      if (barChartRef.current && data.verificationStats && data.verificationStats.length > 0) {
        if (!barChartInstance.current) {
          barChartInstance.current = echarts.init(barChartRef.current);
        }

        const barOption = {
          title: {
            text: 'Verification Status',
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
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: data.verificationStats.map(item => item._id.status)
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: 'Count',
              type: 'bar',
              data: data.verificationStats.map(item => item.count),
              itemStyle: {
                color: '#3b82f6'
              }
            }
          ]
        };

        barChartInstance.current.setOption(barOption);
      }

      // Handle resize
      const handleResize = () => {
        pieChartInstance.current?.resize();
        lineChartInstance.current?.resize();
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
      if (pieChartInstance.current) {
        pieChartInstance.current.dispose();
      }
      if (lineChartInstance.current) {
        lineChartInstance.current.dispose();
      }
      if (barChartInstance.current) {
        barChartInstance.current.dispose();
      }
    };
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
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
      <div className="text-ghibli-red">Error loading analytics: {error}</div>
    </div>
  );

  if (!data) return (
    <div className="bg-ghibli-cream p-6 rounded-lg shadow-ghibli border border-ghibli-brown-light">
      <div className="text-ghibli-brown">No data available</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role Pie Chart */}
        <div className="bg-ghibli-cream p-6 rounded-lg shadow-ghibli border border-ghibli-brown-light">
          <h3 className="text-xl font-semibold mb-4 text-ghibli-dark-blue font-sans">Users by Role</h3>
          {data.usersByRole && data.usersByRole.length > 0 ? (
            <div ref={pieChartRef} style={{ width: '100%', height: '300px' }} />
          ) : (
            <div className="h-80 flex items-center justify-center text-ghibli-brown">
              No user role data available
            </div>
          )}
        </div>

        {/* Registration Trends Line Chart */}
        <div className="bg-ghibli-cream p-6 rounded-lg shadow-ghibli border border-ghibli-brown-light">
          <h3 className="text-xl font-semibold mb-4 text-ghibli-dark-blue font-sans">Registration Trends</h3>
          {data.newUsersOverTime && data.newUsersOverTime.length > 0 ? (
            <div ref={lineChartRef} style={{ width: '100%', height: '300px' }} />
          ) : (
            <div className="h-80 flex items-center justify-center text-ghibli-brown">
              No registration trend data available
            </div>
          )}
        </div>

        {/* Verification Status Chart */}
        <div className="bg-ghibli-cream p-6 rounded-lg shadow-ghibli border border-ghibli-brown-light">
          <h3 className="text-xl font-semibold mb-4 text-ghibli-dark-blue font-sans">Verification Status</h3>
          {data.verificationStats && data.verificationStats.length > 0 ? (
            <div ref={barChartRef} style={{ width: '100%', height: '300px' }} />
          ) : (
            <div className="h-80 flex items-center justify-center text-ghibli-brown">
              No verification data available
            </div>
          )}
        </div>

        {/* User Activity Status */}
        <div className="bg-ghibli-cream p-6 rounded-lg shadow-ghibli border border-ghibli-brown-light">
          <h3 className="text-xl font-semibold mb-4 text-ghibli-dark-blue font-sans">User Activity</h3>
          {data.userActivity && data.userActivity.length > 0 ? (
            <div className="space-y-4">
              {data.userActivity.map((activity, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <span className="font-medium capitalize text-ghibli-dark-blue">{activity._id}</span>
                    <div className="text-sm text-ghibli-brown">
                      Total: {activity.totalUsers?.toLocaleString() || 0}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-ghibli-green">
                      {activity.activeUsers?.toLocaleString() || 0}
                    </div>
                    <div className="text-sm text-ghibli-brown">Active (7d)</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-ghibli-brown">
              No user activity data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAnalyticsChart;
