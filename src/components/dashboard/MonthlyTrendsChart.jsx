import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  PresentationChartLineIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { getMonthlyTrends, getVolunteerAnalytics } from '../../services/analyticsService';

const MonthlyTrendsChart = () => {
  const chartRef = useRef(null);
  const [activeView, setActiveView] = useState('donations');

  const { data: trendsData, isLoading: trendsLoading, isError: trendsError } = useQuery({
    queryKey: ['monthlyTrends', activeView],
    queryFn: () => getMonthlyTrends(activeView),
  });

  const { data: volunteerData, isLoading: volunteerLoading } = useQuery({
    queryKey: ['volunteerAnalytics'],
    queryFn: getVolunteerAnalytics,
    enabled: activeView === 'volunteers'
  });

  const trendViews = {
    donations: {
      title: 'Monthly Donations',
      subtitle: 'Items donated per month',
      color: '#4F7942',
      yAxisLabel: 'Items'
    },
    requests: {
      title: 'Monthly Requests',
      subtitle: 'Items requested per month',
      color: '#DC6803',
      yAxisLabel: 'Items'
    },
    volunteers: {
      title: 'Volunteer Activity',
      subtitle: 'Active volunteers and hours contributed',
      color: '#2D5016',
      yAxisLabel: 'Count / Hours'
    }
  };

  const currentView = trendViews[activeView];
  const isLoading = trendsLoading || (activeView === 'volunteers' && volunteerLoading);

  useEffect(() => {
    let chart;
    if (chartRef.current && (trendsData || volunteerData)) {
      chart = echarts.init(chartRef.current);

      let option;

      if (activeView === 'volunteers' && volunteerData) {
        const months = volunteerData.map(item => item.month);
        const activeVolunteers = volunteerData.map(item => item.active);
        const totalHours = volunteerData.map(item => item.hours);

        option = {
          tooltip: {
            trigger: 'axis',
            backgroundColor: '#F5F1E8',
            borderColor: '#8B7355',
            borderWidth: 1,
            textStyle: {
              color: '#4A3728',
              fontSize: 12,
              fontFamily: 'Inter, sans-serif'
            },
            formatter: function(params) {
              let result = `<div style="font-weight: 600; margin-bottom: 8px;">${params[0].axisValue}</div>`;
              params.forEach(param => {
                result += `<div style="margin: 4px 0;">
                            <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 50%; margin-right: 8px;"></span>
                            <span>${param.seriesName}: ${param.value}</span>
                          </div>`;
              });
              return result;
            }
          },
          legend: {
            data: ['Active Volunteers', 'Total Hours'],
            top: 10,
            textStyle: {
              color: '#4A3728',
              fontSize: 12
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '15%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: months,
              axisLabel: {
                color: '#4A3728',
                fontSize: 11
              },
              axisLine: {
                lineStyle: {
                  color: '#8B7355'
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: 'Volunteers',
              position: 'left',
              axisLabel: {
                color: '#4A3728',
                fontSize: 11
              },
              axisLine: {
                lineStyle: {
                  color: '#8B7355'
                }
              },
              splitLine: {
                lineStyle: {
                  color: '#E8E3D3',
                  type: 'dashed'
                }
              }
            },
            {
              type: 'value',
              name: 'Hours',
              position: 'right',
              axisLabel: {
                color: '#4A3728',
                fontSize: 11
              },
              axisLine: {
                lineStyle: {
                  color: '#8B7355'
                }
              }
            }
          ],
          series: [
            {
              name: 'Active Volunteers',
              type: 'line',
              yAxisIndex: 0,
              data: activeVolunteers,
              lineStyle: {
                color: '#2D5016',
                width: 3
              },
              itemStyle: {
                color: '#2D5016'
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(45, 80, 22, 0.3)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(45, 80, 22, 0.05)'
                  }
                ])
              },
              symbol: 'circle',
              symbolSize: 8,
              smooth: true
            },
            {
              name: 'Total Hours',
              type: 'line',
              yAxisIndex: 1,
              data: totalHours,
              lineStyle: {
                color: '#4F7942',
                width: 3
              },
              itemStyle: {
                color: '#4F7942'
              },
              symbol: 'circle',
              symbolSize: 8,
              smooth: true
            }
          ]
        };
      } else if (trendsData) {
        const months = trendsData.map(item => item.month);
        const values = trendsData.map(item => item.value);

        option = {
          tooltip: {
            trigger: 'axis',
            backgroundColor: '#F5F1E8',
            borderColor: '#8B7355',
            borderWidth: 1,
            textStyle: {
              color: '#4A3728',
              fontSize: 12,
              fontFamily: 'Inter, sans-serif'
            },
            formatter: function(params) {
              const param = params[0];
              const value = param.value;
              const prevValue = param.dataIndex > 0 ? values[param.dataIndex - 1] : value;
              const change = value - prevValue;
              const changePercent = prevValue !== 0 ? ((change / prevValue) * 100).toFixed(1) : 0;
              const changeColor = change >= 0 ? '#4F7942' : '#DC6803';

              return `<div style="font-weight: 600; margin-bottom: 8px;">${param.axisValue}</div>
                      <div style="margin: 4px 0;">
                        <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 50%; margin-right: 8px;"></span>
                        <span>${currentView.title}: ${value.toLocaleString()}</span>
                      </div>
                      ${param.dataIndex > 0 ? `<div style="margin-top: 8px; color: ${changeColor}; font-size: 11px;">
                        ${change >= 0 ? '↗' : '↘'} ${Math.abs(change).toLocaleString()} (${changePercent}%)
                      </div>` : ''}`;
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '8%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: months,
              axisLabel: {
                color: '#4A3728',
                fontSize: 11
              },
              axisLine: {
                lineStyle: {
                  color: '#8B7355'
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                color: '#4A3728',
                fontSize: 11,
                formatter: function(value) {
                  if (value >= 1000) {
                    return (value / 1000).toFixed(1) + 'k';
                  }
                  return value;
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#8B7355'
                }
              },
              splitLine: {
                lineStyle: {
                  color: '#E8E3D3',
                  type: 'dashed'
                }
              }
            }
          ],
          series: [
            {
              name: currentView.title,
              type: 'line',
              data: values,
              lineStyle: {
                color: currentView.color,
                width: 4
              },
              itemStyle: {
                color: currentView.color
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: currentView.color + '40'
                  },
                  {
                    offset: 1,
                    color: currentView.color + '05'
                  }
                ])
              },
              symbol: 'circle',
              symbolSize: 10,
              smooth: true
            }
          ]
        };
      }

      chart.setOption(option);
    }

    const handleResize = () => {
      if (chart) {
        chart.resize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (chart) {
        chart.dispose();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [trendsData, volunteerData, activeView]);

  const calculateTrend = () => {
    if (!trendsData || trendsData.length < 2) return { trend: 'stable', change: 0, changePercent: 0 };

    const recent = trendsData[trendsData.length - 1].value;
    const previous = trendsData[trendsData.length - 2].value;
    const change = recent - previous;
    const changePercent = previous !== 0 ? ((change / previous) * 100) : 0;

    return {
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      change: Math.abs(change),
      changePercent: Math.abs(changePercent).toFixed(1)
    };
  };

  const trendInfo = calculateTrend();

  if (trendsError) {
    return (
      <div className="bg-ghibli-cream rounded-lg shadow-ghibli p-6">
        <div className="text-center text-ghibli-red">
          <p>Error loading trends data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ghibli-cream rounded-lg shadow-ghibli p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-ghibli-dark-blue mb-2 handwritten">
              Platform Trends
            </h3>
            <p className="text-ghibli-brown text-sm">
              {currentView.subtitle}
            </p>
          </div>

          {/* View Switcher */}
          <div className="flex gap-2">
            {Object.entries(trendViews).map(([key, view]) => (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                disabled={isLoading}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeView === key
                    ? 'bg-ghibli-teal text-ghibli-cream shadow-md'
                    : 'bg-ghibli-cream-light text-ghibli-brown hover:bg-ghibli-teal-light'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {view.title.split(' ')[1] || view.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-ghibli-cream-lightest rounded-lg p-4 min-h-[300px]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-ghibli-brown">Loading trends data...</div>
              </div>
            ) : (
              <div
                ref={chartRef}
                className="w-full h-full min-h-[280px]"
              />
            )}
          </motion.div>
        </div>

        {/* Trend Summary */}
        <div className="space-y-4">
          <h4 className="font-semibold text-ghibli-dark-blue flex items-center gap-2">
            <CalendarDaysIcon className="h-5 w-5 text-ghibli-teal" />
            Trend Summary
          </h4>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="bg-ghibli-cream-lightest rounded-lg p-3 animate-pulse">
                  <div className="h-4 bg-ghibli-brown-light rounded mb-2"></div>
                  <div className="h-6 bg-ghibli-brown-light rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Current Trend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg p-4 border ${
                  trendInfo.trend === 'up'
                    ? 'bg-ghibli-green-lightest border-ghibli-green-light'
                    : trendInfo.trend === 'down'
                    ? 'bg-ghibli-red-lightest border-ghibli-red-light'
                    : 'bg-ghibli-blue-lightest border-ghibli-blue-light'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {trendInfo.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="h-5 w-5 text-ghibli-green" />
                  ) : trendInfo.trend === 'down' ? (
                    <ArrowTrendingDownIcon className="h-5 w-5 text-ghibli-red" />
                  ) : (
                    <PresentationChartLineIcon className="h-5 w-5 text-ghibli-blue" />
                  )}
                  <span className="font-medium text-sm">
                    {trendInfo.trend === 'up' ? 'Increasing' : trendInfo.trend === 'down' ? 'Decreasing' : 'Stable'}
                  </span>
                </div>
                <div className="text-lg font-bold" style={{ color: currentView.color }}>
                  {trendInfo.changePercent}%
                </div>
                <div className="text-xs text-ghibli-brown-dark">
                  vs previous month
                </div>
              </motion.div>

              {/* Latest Value */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-ghibli-cream-lightest rounded-lg p-4"
              >
                <div className="text-sm text-ghibli-brown-dark mb-1">
                  Latest ({trendsData && trendsData[trendsData.length - 1]?.month})
                </div>
                <div className="text-2xl font-bold" style={{ color: currentView.color }}>
                  {trendsData && trendsData[trendsData.length - 1]?.value.toLocaleString()}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyTrendsChart;
