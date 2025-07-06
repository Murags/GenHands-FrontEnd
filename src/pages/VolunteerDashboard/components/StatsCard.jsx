import React from 'react';

const StatsCard = ({ title, value, subtitle, icon: Icon, bgColor, textColor }) => (
  <div className="bg-ghibli-cream p-5 rounded-lg shadow-ghibli border" style={{ borderColor: 'var(--color-ghibli-brown-light)' }}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-ghibli-dark-blue font-sans">{title}</h3>
        <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        <p className="text-sm text-ghibli-brown mt-1">{subtitle}</p>
      </div>
      <div className={`p-3 rounded-full ${bgColor} bg-opacity-20`}>
        <Icon className="h-8 w-8 text-ghibli-dark-blue opacity-90" />
      </div>
    </div>
  </div>
);

export default StatsCard;
