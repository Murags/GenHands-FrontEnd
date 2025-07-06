import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  HeartIcon,
  UsersIcon,
  BuildingOfficeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { getMapData } from '../../services/mapService';

const KenyaImpactMap = () => {
  const chartRef = useRef(null);
  const [activeView, setActiveView] = useState('charities');

  const { data: mapData, isLoading, isError } = useQuery({
    queryKey: ['mapData', activeView],
    queryFn: () => getMapData(activeView),
  });

  const dataViews = {
    charities: {
      title: 'Registered Charities',
      subtitle: 'Distribution of verified charities across Kenya',
      icon: BuildingOfficeIcon,
      color: '#4F7942',
      lightColor: '#E8F5E8',
    },
    donors: {
      title: 'Active Donors',
      subtitle: 'Number of registered donors by county',
      icon: UsersIcon,
      color: '#2D5016',
      lightColor: '#F0F8F0',
    },
    donations: {
      title: 'Donation Impact',
      subtitle: 'Total value of donations received (KES)',
      icon: HeartIcon,
      color: '#8B2635',
      lightColor: '#FDF2F2',
    }
  };

  const currentView = dataViews[activeView];

  useEffect(() => {
    let chart;
    if (chartRef.current && mapData) {
      chart = echarts.init(chartRef.current);
      chart.showLoading({
        text: 'Loading Kenya Map...',
        color: '#4F7942',
        textColor: '#4A3728',
        maskColor: 'rgba(245, 241, 232, 0.8)'
      });

      fetch('/kenya.json')
        .then(response => response.json())
        .then(kenyaJson => {
          chart.hideLoading();

          // Transform the data to match what ECharts expects
          const mapGeoData = {
            type: 'FeatureCollection',
            features: kenyaJson.features.map(feature => ({
              ...feature,
              properties: {
                name: feature.properties.COUNTY_NAM,
                ...feature.properties
              }
            }))
          };

          echarts.registerMap('Kenya', mapGeoData);

          const maxValue = Math.max(...mapData.map(item => item.value));
          const minValue = Math.min(...mapData.map(item => item.value));

          const option = {
            tooltip: {
              trigger: 'item',
              showDelay: 0,
              transitionDuration: 0.2,
              backgroundColor: '#F5F1E8',
              borderColor: '#8B7355',
              borderWidth: 1,
              textStyle: {
                color: '#4A3728',
                fontSize: 12,
                fontFamily: 'Inter, sans-serif'
              },
              formatter: function(params) {
                if (params.value) {
                  let formattedValue = params.value;
                  if (activeView === 'donations') {
                    formattedValue = `KES ${params.value.toLocaleString()}`;
                  } else {
                    formattedValue = params.value.toLocaleString();
                  }
                  return `<div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
                          <div>${currentView.title}: ${formattedValue}</div>`;
                }
                return `<div style="font-weight: 600;">${params.name}</div>
                        <div>No data available</div>`;
              }
            },
            visualMap: {
              left: 'right',
              top: 'center',
              min: minValue,
              max: maxValue,
              inRange: {
                color: [
                  '#F5F1E8',
                  currentView.lightColor,
                  currentView.color + '80',
                  currentView.color,
                  currentView.color + 'CC'
                ]
              },
              text: ['High', 'Low'],
              calculable: true,
              seriesIndex: [0],
              orient: 'vertical',
              showLabel: true,
              itemWidth: 12,
              itemHeight: 100,
              textStyle: {
                color: '#4A3728',
                fontSize: 11,
                fontFamily: 'Inter, sans-serif'
              },
              controller: {
                inRange: {
                  color: currentView.color
                }
              }
            },
            series: [
              {
                name: currentView.title,
                type: 'map',
                map: 'Kenya',
                roam: false,
                aspectScale: 1,
                layoutCenter: ['50%', '50%'],
                layoutSize: '90%',
                emphasis: {
                  label: {
                    show: true,
                    fontSize: 11,
                    color: '#4A3728',
                    fontWeight: 'bold'
                  },
                  itemStyle: {
                    areaColor: currentView.color + 'AA',
                    borderColor: '#4A3728',
                    borderWidth: 2
                  }
                },
                select: {
                  disabled: true
                },
                itemStyle: {
                  areaColor: '#E8E3D3',
                  borderColor: '#8B7355',
                  borderWidth: 1
                },
                data: mapData
              }
            ]
          };

          chart.setOption(option);
        })
        .catch(error => {
          console.error('Error loading Kenya map data:', error);
          chart.hideLoading();
        });
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
  }, [activeView, mapData]);

  const formatValue = (value) => {
    if (activeView === 'donations') {
      return `KES ${(value / 1000000).toFixed(1)}M`;
    }
    return value.toLocaleString();
  };

  if (isError) {
    return (
      <div className="bg-ghibli-cream rounded-lg shadow-ghibli p-6">
        <div className="text-center text-ghibli-red">
          <p>Error loading map data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ghibli-cream rounded-lg shadow-ghibli p-6">
      {/* Header with view switcher */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-ghibli-dark-blue mb-2 font-sans">
          Impact Across Kenya
        </h3>
        <p className="text-ghibli-brown text-sm mb-4">{currentView.subtitle}</p>

        {/* View Switcher */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(dataViews).map(([key, view]) => {
            const Icon = view.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                disabled={isLoading}
                className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeView === key
                    ? 'bg-ghibli-teal text-ghibli-cream shadow-md'
                    : 'bg-ghibli-cream-light text-ghibli-brown hover:bg-ghibli-teal-light hover:text-ghibli-dark-blue'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Icon className="h-4 w-4" />
                {view.title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-ghibli-cream-lightest rounded-lg p-4 min-h-[400px] lg:min-h-[500px]"
          >
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-ghibli-brown">Loading map data...</div>
              </div>
            )}
            <div
              ref={chartRef}
              className="w-full h-full min-h-[380px] lg:min-h-[480px]"
              style={{ display: isLoading ? 'none' : 'block' }}
            />
          </motion.div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <currentView.icon className="h-5 w-5 text-ghibli-teal" />
            <h4 className="font-semibold text-ghibli-dark-blue">Top Counties</h4>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-ghibli-cream-lightest rounded-lg p-3 animate-pulse">
                  <div className="h-4 bg-ghibli-brown-light rounded mb-2"></div>
                  <div className="h-2 bg-ghibli-brown-light rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            mapData && mapData
              .sort((a, b) => b.value - a.value)
              .slice(0, 8)
              .map((county, index) => (
                <motion.div
                  key={`${activeView}-${county.name}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-ghibli-cream-lightest hover:bg-ghibli-cream-light rounded-lg p-3 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-ghibli-teal bg-ghibli-teal-light rounded-full w-5 h-5 flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="font-medium text-ghibli-dark-blue text-sm">
                        {county.name}
                      </span>
                    </div>
                    <span className="font-bold text-sm" style={{ color: currentView.color }}>
                      {formatValue(county.value)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-ghibli-brown-light rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(county.value / Math.max(...mapData.map(d => d.value))) * 100}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: currentView.color }}
                    />
                  </div>
                </motion.div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default KenyaImpactMap;
