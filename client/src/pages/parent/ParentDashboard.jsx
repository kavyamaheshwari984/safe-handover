import React, { useState, useEffect } from 'react';
import { MdChildCare, MdDirectionsRun, MdHistory } from 'react-icons/md';
import StatCard from '../../components/StatCard';
import { childrenApi } from '../../api/childrenApi';
import { pickupRequestApi } from '../../api/pickupRequestApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const ParentDashboard = () => {
  const [stats, setStats] = useState({ children: 0, activeRequests: 0, totalRequests: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [childrenRes, requestsRes] = await Promise.all([
          childrenApi.getAllChildren(),
          pickupRequestApi.getRequests()
        ]);
        
        const childrenCount = childrenRes.children.length;
        const activeRequests = requestsRes.requests.filter(r => ['PENDING', 'APPROVED'].includes(r.status)).length;
        
        setStats({
          children: childrenCount,
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
          title="My Children" 
          value={stats.children} 
          icon={<MdChildCare />} 
          variant="primary" 
        />
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

export default ParentDashboard;
