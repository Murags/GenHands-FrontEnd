import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import { getCategoryAnalysis } from '../../services/analyticsService';

const CategoryAnalysisChart = () => {
  const chartRef = useRef(null);
  const [chartType, setChartType] = useState('bar');

  const { data: categoryData, isLoading, isError } = useQuery({
    queryKey: ['categoryAnalysis'],
    queryFn: getCategoryAnalysis,
  });

  useEffect(() => {
    let chart;
    if (chartRef.current && categoryData) {
      chart = echarts.init(chartRef.current);

      const categories = categoryData.map(item => item.category);
      const needed = categoryData.map(item => item.needed);
      const donated = categoryData.map(item => item.donated);
      const gap = categoryData.map(item => item.needed - item.donated);

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
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
              const color = param.color;
              const value = param.value;
              result += `<div style="margin: 4px 0; display: flex; align-items: center;">
                          <span style="display: inline-block; width: 10px; height: 10px; background: ${color}; border-radius: 50%; margin-right: 8px;"></span>
                          <span>${param.seriesName}: ${value.toLocaleString()}</span>
                        </div>`;
            });

            const category = categoryData.find(c => c.category === params[0].axisValue);
            if (category) {
              const gapValue = category.needed - category.donated;
              const gapColor = gapValue > 0 ? '#DC6803' : '#4F7942';
              result += `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #8B7355;">
                          <span style="color: ${gapColor}; font-weight: 600;">
                            ${gapValue > 0 ? 'Gap' : 'Surplus'}: ${Math.abs(gapValue).toLocaleString()}
                          </span>
                        </div>`;
            }
            return result;
          }
        },
        legend: {
          data: ['Items Needed', 'Items Donated'],
          top: 10,
          textStyle: {
            color: '#4A3728',
            fontSize: 12,
            fontFamily: 'Inter, sans-serif'
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
            data: categories,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              color: '#4A3728',
              fontSize: 11,
              rotate: 45,
              fontFamily: 'Inter, sans-serif'
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
              fontFamily: 'Inter, sans-serif',
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
        series: chartType === 'bar' ? [
          {
            name: 'Items Needed',
            type: 'bar',
            barWidth: '35%',
            data: needed,
            itemStyle: {
              color: '#DC6803', // ghibli-orange for needed items
              borderRadius: [4, 4, 0, 0]
            },
            emphasis: {
              itemStyle: {
                color: '#B85400'
              }
            }
          },
          {
            name: 'Items Donated',
            type: 'bar',
            barWidth: '35%',
            data: donated,
            itemStyle: {
              color: '#4F7942', // ghibli-green for donated items
              borderRadius: [4, 4, 0, 0]
            },
            emphasis: {
              itemStyle: {
                color: '#3A5B32'
              }
            }
          }
        ] : [
          {
            name: 'Items Needed',
            type: 'line',
            data: needed,
            lineStyle: {
              color: '#DC6803',
              width: 3
            },
            itemStyle: {
              color: '#DC6803'
            },
            symbol: 'circle',
            symbolSize: 8,
            smooth: true
          },
          {
            name: 'Items Donated',
            type: 'line',
            data: donated,
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
  }, [categoryData, chartType]);

  if (isError) {
    return (
      <div className="bg-ghibli-cream rounded-lg shadow-ghibli p-6">
        <div className="text-center text-ghibli-red">
          <p>Error loading category data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const calculateInsights = () => {
    if (!categoryData) return { totalGap: 0, surplusCategories: 0, gapCategories: 0 };

    let totalGap = 0;
    let surplusCategories = 0;
    let gapCategories = 0;

    categoryData.forEach(category => {
      const gap = category.needed - category.donated;
      if (gap > 0) {
        gapCategories++;
        totalGap += gap;
      } else if (gap < 0) {
        surplusCategories++;
      }
    });

    return { totalGap, surplusCategories, gapCategories };
  };

  const insights = calculateInsights();

  return (
    <div className="bg-ghibli-cream rounded-lg shadow-ghibli p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-ghibli-dark-blue mb-2 handwritten">
              Supply & Demand Analysis
            </h3>
            <p className="text-ghibli-brown text-sm">
              Comparing donation requests with actual donations by category
            </p>
          </div>

          {/* Chart Type Switcher */}
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                chartType === 'bar'
                  ? 'bg-ghibli-teal text-ghibli-cream shadow-md'
                  : 'bg-ghibli-cream-light text-ghibli-brown hover:bg-ghibli-teal-light'
              }`}
            >
              <ChartBarIcon className="h-4 w-4" />
              Bar
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                chartType === 'line'
                  ? 'bg-ghibli-teal text-ghibli-cream shadow-md'
                  : 'bg-ghibli-cream-light text-ghibli-brown hover:bg-ghibli-teal-light'
              }`}
            >
              <ArrowTrendingUpIcon className="h-4 w-4" />
              Line
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3">
          <motion.div
            key={chartType}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-ghibli-cream-lightest rounded-lg p-4 min-h-[400px]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-ghibli-brown">Loading category data...</div>
              </div>
            ) : (
              <div
                ref={chartRef}
                className="w-full h-full min-h-[380px]"
              />
            )}
          </motion.div>
        </div>

        {/* Insights Panel */}
        <div className="space-y-4">
          <h4 className="font-semibold text-ghibli-dark-blue flex items-center gap-2">
            <ScaleIcon className="h-5 w-5 text-ghibli-teal" />
            Key Insights
          </h4>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-ghibli-cream-lightest rounded-lg p-3 animate-pulse">
                  <div className="h-4 bg-ghibli-brown-light rounded mb-2"></div>
                  <div className="h-6 bg-ghibli-brown-light rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Total Gap */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-ghibli-red-lightest border border-ghibli-red-light rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <ArrowTrendingDownIcon className="h-5 w-5 text-ghibli-red" />
                  <span className="font-medium text-ghibli-red-dark text-sm">Total Gap</span>
                </div>
                <div className="text-2xl font-bold text-ghibli-red">
                  {insights.totalGap.toLocaleString()}
                </div>
                <div className="text-xs text-ghibli-red-dark mt-1">
                  Items still needed
                </div>
              </motion.div>

              {/* Categories with Gaps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-ghibli-yellow-lightest border border-ghibli-yellow-light rounded-lg p-4"
              >
                <div className="text-lg font-bold text-ghibli-orange">
                  {insights.gapCategories}
                </div>
                <div className="text-sm text-ghibli-brown-dark">
                  Categories with unmet needs
                </div>
              </motion.div>

              {/* Categories with Surplus */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-ghibli-green-lightest border border-ghibli-green-light rounded-lg p-4"
              >
                <div className="text-lg font-bold text-ghibli-green-dark">
                  {insights.surplusCategories}
                </div>
                <div className="text-sm text-ghibli-brown-dark">
                  Categories with surplus
                </div>
              </motion.div>

              {/* Top Gap Categories */}
              {categoryData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-ghibli-cream-lightest rounded-lg p-4"
                >
                  <div className="font-medium text-ghibli-dark-blue text-sm mb-3">
                    Biggest Gaps
                  </div>
                  <div className="space-y-2">
                    {categoryData
                      .filter(cat => cat.needed > cat.donated)
                      .sort((a, b) => (b.needed - b.donated) - (a.needed - a.donated))
                      .slice(0, 3)
                      .map((category, index) => (
                        <div key={category.category} className="flex justify-between items-center text-xs">
                          <span className="text-ghibli-brown-dark truncate">
                            {category.category}
                          </span>
                          <span className="font-bold text-ghibli-red ml-2">
                            {(category.needed - category.donated).toLocaleString()}
                          </span>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryAnalysisChart;
