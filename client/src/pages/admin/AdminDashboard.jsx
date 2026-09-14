import React, { useState, useEffect } from 'react';
import { MdChildCare, MdDirectionsRun, MdHistory, MdSecurity } from 'react-icons/md';
import StatCard from '../../components/StatCard';
import { childrenApi } from '../../api/childrenApi';
import { pickupRequestApi } from '../../api/pickupRequestApi';
import { handoverApi } from '../../api/handoverApi';
import { guardianAuthApi } from '../../api/guardianAuthApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ children: 0, activeRequests: 0, handovers: 0, guardians: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [childrenRes, requestsRes, handoversRes, authRes] = await Promise.all([
          childrenApi.getAllChildren(),
          pickupRequestApi.getRequests(),
          handoverApi.getHandovers(),
          guardianAuthApi.getAuthorizations()
        ]);
        
        const activeRequests = requestsRes.requests.filter(r => ['PENDING', 'APPROVED'].includes(r.status)).length;
        
        setStats({
          children: childrenRes.children.length,
          activeRequests: activeRequests,
          handovers: handoversRes.handovers.length,
          guardians: authRes.authorizations.length
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
      <h1 className="page-title">Admin Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <StatCard 
          title="Total Children" 
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
          title="Total Handovers" 
          value={stats.handovers} 
          icon={<MdHistory />} 
          variant="success" 
        />
        <StatCard 
          title="Guardian Authorizations" 
          value={stats.guardians} 
          icon={<MdSecurity />} 
          variant="primary" 
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
