import React from 'react';
import { MdAccountCircle, MdLogout } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-brand" style={{ fontWeight: '600' }}>
        Dashboard
      </div>
      
      <div className="navbar-user" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{user?.name}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>
            {user?.role}
          </span>
        </div>
        <MdAccountCircle size={32} color="var(--color-text-secondary)" />
        <button 
          onClick={handleLogout}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', display: 'flex', alignItems: 'center' }}
          title="Logout"
        >
          <MdLogout size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
