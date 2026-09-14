import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/components.css'; // ensure styles are imported
import { MdShield } from 'react-icons/md';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-primary)', marginBottom: '1rem' }}>
            <MdShield size={48} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Safe Handover</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Secure child pickup management</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
