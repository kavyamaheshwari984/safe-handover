import React, { useState, useEffect } from 'react';
import { MdHistory, MdVpnKey } from 'react-icons/md';
import StatCard from '../../components/StatCard';
import { handoverApi } from '../../api/handoverApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const StaffDashboard = () => {
  const [stats, setStats] = useState({ handoversCompleted: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await handoverApi.getHandovers();
        setStats({
          handoversCompleted: res.handovers.length
        });
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="page-title">Welcome, {user.name}</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <StatCard 
          title="Handovers Completed (You)" 
          value={stats.handoversCompleted} 
          icon={<MdHistory />} 
          variant="success" 
        />
        <StatCard 
          title="Pending Verification" 
          value="Ready" 
          icon={<MdVpnKey />} 
          variant="primary" 
        />
      </div>
    </div>
  );
};

export default StaffDashboard;
