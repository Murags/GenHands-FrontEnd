import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useSupplyDemandData } from '../../hooks/useAdminDashboard';

const SupplyDemandChart = ({ timeframe = '30d' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { data, loading, error } = useSupplyDemandData({ timeframe });

  useEffect(() => {
    if (chartRef.current && data && data.supplyDemandData) {
      // Initialize chart if not already done
      if (!chartInstance.current) {
        chartInstance.current = echarts.init(chartRef.current);
      }

      const categories = data.supplyDemandData.map(item => item.category);
      const itemsNeeded = data.supplyDemandData.map(item => item.itemsNeeded);
      const itemsDonated = data.supplyDemandData.map(item => item.itemsDonated);

      const option = {
        title: {
          text: 'Supply & Demand Analysis',
          left: 'center',
          textStyle: {
            color: '#2c3e50',
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            let result = `<strong>${params[0].axisValue}</strong><br/>`;
            params.forEach(param => {
              result += `${param.marker} ${param.seriesName}: ${param.value.toLocaleString()}<br/>`;
            });
            if (params.length >= 2) {
              const gap = params[0].value - params[1].value;
              result += `Gap: ${gap.toLocaleString()} items`;
            }
            return result;
          }
        },
        legend: {
          data: ['Items Needed', 'Items Donated'],
          top: 30
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: categories,
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
            name: 'Items Needed',
            type: 'bar',
            data: itemsNeeded,
            itemStyle: {
              color: '#ef4444'
            }
          },
          {
            name: 'Items Donated',
            type: 'bar',
            data: itemsDonated,
            itemStyle: {
              color: '#22c55e'
            }
          }
        ]
      };

      chartInstance.current.setOption(option);

      // Handle resize
      const handleResize = () => {
        chartInstance.current?.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [data]);

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

  if (loading) return (
    <div className="bg-ghibli-cream p-6 rounded-lg shadow-ghibli border border-ghibli-brown-light">
      <div className="h-96 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
        <span className="text-ghibli-brown">Loading chart...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-ghibli-cream p-6 rounded-lg shadow-ghibli border border-ghibli-brown-light">
      <div className="text-ghibli-red">Error loading chart: {error}</div>
    </div>
  );

  if (!data || !data.supplyDemandData) return (
    <div className="bg-ghibli-cream p-6 rounded-lg shadow-ghibli border border-ghibli-brown-light">
      <div className="text-ghibli-brown">No data available</div>
    </div>
  );

  return (
    <div className="bg-ghibli-cream p-6 rounded-lg shadow-ghibli border border-ghibli-brown-light">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-ghibli-dark-blue handwritten">Supply & Demand Analysis</h3>
        <div className="text-sm text-ghibli-brown">
          Period: {timeframe}
        </div>
      </div>

      {/* Key Insights */}
      {data.keyInsights && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center bg-white p-4 rounded-lg">
            <div className="text-2xl font-bold text-ghibli-red">
              {data.keyInsights.totalGap?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-ghibli-brown">Total Gap</div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg">
            <div className="text-2xl font-bold text-ghibli-orange">
              {data.keyInsights.categoriesWithUnmetNeeds || 0}
            </div>
            <div className="text-sm text-ghibli-brown">Unmet Needs</div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg">
            <div className="text-2xl font-bold text-ghibli-green">
              {data.keyInsights.categoriesWithSurplus || 0}
            </div>
            <div className="text-sm text-ghibli-brown">Surplus Categories</div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg">
            <div className="text-2xl font-bold text-ghibli-blue">
              {data.supplyDemandData.length}
            </div>
            <div className="text-sm text-ghibli-brown">Total Categories</div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white p-4 rounded-lg">
        <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
      </div>

      {/* Biggest Gaps */}
      {data.keyInsights?.biggestGaps && (
        <div className="mt-6">
          <h4 className="font-semibold text-ghibli-dark-blue mb-3 handwritten">Biggest Gaps</h4>
          <div className="space-y-2">
            {data.keyInsights.biggestGaps.slice(0, 5).map((gap, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <span className="font-medium text-ghibli-dark-blue">{gap.category}</span>
                <span className="text-ghibli-red font-bold">{gap.gap?.toLocaleString() || 0} items</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplyDemandChart;
