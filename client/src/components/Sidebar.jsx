import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  MdDashboard, 
  MdChildCare, 
  MdSecurity, 
  MdDirectionsRun, 
  MdVpnKey, 
  MdHistory, 
  MdListAlt,
  MdShield
} from 'react-icons/md';

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || '';

  const getLinks = () => {
    switch (role) {
      case 'parent':
        return [
          { to: '/parent', label: 'Dashboard', icon: <MdDashboard /> },
          { to: '/parent/children', label: 'My Children', icon: <MdChildCare /> },
          { to: '/parent/guardians', label: 'Guardians', icon: <MdSecurity /> },
          { to: '/parent/pickup-requests', label: 'Pickup Requests', icon: <MdDirectionsRun /> },
          { to: '/parent/otp', label: 'OTP Management', icon: <MdVpnKey /> },
          { to: '/parent/handovers', label: 'Handovers', icon: <MdHistory /> },
          { to: '/parent/audit-logs', label: 'Audit Logs', icon: <MdListAlt /> },
        ];
      case 'guardian':
        return [
          { to: '/guardian', label: 'Dashboard', icon: <MdDashboard /> },
          { to: '/guardian/pickup-requests', label: 'Pickup Requests', icon: <MdDirectionsRun /> },
          { to: '/guardian/handovers', label: 'Handovers', icon: <MdHistory /> },
          { to: '/guardian/audit-logs', label: 'Audit Logs', icon: <MdListAlt /> },
        ];
      case 'staff':
        return [
          { to: '/staff', label: 'Dashboard', icon: <MdDashboard /> },
          { to: '/staff/verify-otp', label: 'Verify OTP', icon: <MdVpnKey /> },
          { to: '/staff/handovers', label: 'Handovers', icon: <MdHistory /> },
          { to: '/staff/audit-logs', label: 'Audit Logs', icon: <MdListAlt /> },
        ];
      case 'admin':
        return [
          { to: '/admin', label: 'Dashboard', icon: <MdDashboard /> },
          { to: '/admin/children', label: 'All Children', icon: <MdChildCare /> },
          { to: '/admin/guardians', label: 'Authorizations', icon: <MdSecurity /> },
          { to: '/admin/pickup-requests', label: 'Pickup Requests', icon: <MdDirectionsRun /> },
          { to: '/admin/otp', label: 'OTP Management', icon: <MdVpnKey /> },
          { to: '/admin/handovers', label: 'Handovers', icon: <MdHistory /> },
          { to: '/admin/audit-logs', label: 'Audit Logs', icon: <MdListAlt /> },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <MdShield size={24} />
        Safe Handover
      </div>
      <nav className="sidebar-nav">
        {links.map((link, idx) => (
          <NavLink 
            key={idx} 
            to={link.to} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={link.to === `/${role}`} // exact match for dashboard home
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
