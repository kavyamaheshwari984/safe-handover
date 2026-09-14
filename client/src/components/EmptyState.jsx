import React from 'react';
import { MdInbox } from 'react-icons/md';

const EmptyState = ({ message = 'No data available', icon = <MdInbox size={48} /> }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      color: 'var(--color-text-secondary)',
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--color-border)'
    }}>
      <div style={{ marginBottom: '1rem', color: 'var(--color-text-tertiary)' }}>
        {icon}
      </div>
      <p style={{ fontWeight: '500' }}>{message}</p>
    </div>
  );
};

export default EmptyState;
