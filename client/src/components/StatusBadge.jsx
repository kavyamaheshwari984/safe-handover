import React from 'react';

const StatusBadge = ({ status }) => {
  const normalizedStatus = status.toLowerCase();
  
  // Mapping for frontend badge classes based on status string
  let badgeClass = 'badge-pending';
  
  if (['approved', 'active'].includes(normalizedStatus)) {
    badgeClass = 'badge-approved';
  } else if (['completed'].includes(normalizedStatus)) {
    badgeClass = 'badge-completed';
  } else if (['rejected', 'expired', 'cancelled'].includes(normalizedStatus)) {
    badgeClass = 'badge-rejected';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
