import React, { useState, useEffect } from 'react';
import { MdDirectionsRun, MdHistory } from 'react-icons/md';
import StatCard from '../../components/StatCard';
import { pickupRequestApi } from '../../api/pickupRequestApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const GuardianDashboard = () => {
  const [stats, setStats] = useState({ activeRequests: 0, totalRequests: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const requestsRes = await pickupRequestApi.getRequests();
        const activeRequests = requestsRes.requests.filter(r => ['PENDING', 'APPROVED'].includes(r.status)).length;
        
        setStats({
          activeRequests: activeRequests,
          totalRequests: requestsRes.requests.length
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
          title="Active Pickup Requests" 
          value={stats.activeRequests} 
          icon={<MdDirectionsRun />} 
          variant="warning" 
        />
        <StatCard 
          title="Total Requests History" 
          value={stats.totalRequests} 
          icon={<MdHistory />} 
          variant="success" 
        />
      </div>
    </div>
  );
};

export default GuardianDashboard;
