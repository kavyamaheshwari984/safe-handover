import React from 'react';

const StatCard = ({ title, value, icon, variant = 'primary' }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${variant}`}>
        {icon}
      </div>
      <div className="stat-info">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
