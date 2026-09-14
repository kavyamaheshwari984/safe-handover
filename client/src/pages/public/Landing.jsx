import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MdShield } from 'react-icons/md';

const Landing = () => {
  const { user, token } = useAuth();

  if (token && user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return (
    <div className="page-container" style={{ alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-background) 100%)' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', padding: '2rem' }}>
        <MdShield size={80} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
          Safe Handover
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', marginBottom: '2.5rem' }}>
          A secure, OTP-based system for managing child dismissals and pickups. 
          Ensuring safety from the classroom to the car.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>
            Login
          </Link>
          <Link to="/register" className="btn btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>
            Register as Parent
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
