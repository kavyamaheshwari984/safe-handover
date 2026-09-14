import React, { useState, useEffect } from 'react';
import { handoverApi } from '../../api/handoverApi';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const HandoverHistory = () => {
  const [handovers, setHandovers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHandovers = async () => {
      try {
        const res = await handoverApi.getHandovers();
        setHandovers(res.handovers);
      } catch (error) {
        toast.error('Failed to load handovers');
      } finally {
        setLoading(false);
      }
    };

    fetchHandovers();
  }, []);

  const columns = [
    { header: 'Child', cell: (row) => row.child?.name },
    { header: 'Picked Up By', cell: (row) => `${row.pickedUpBy?.name} (${row.pickedUpBy?.role})` },
    { header: 'Staff (Verified By)', cell: (row) => row.staff?.name },
    { header: 'Time', cell: (row) => new Date(row.handedOverAt).toLocaleString() },
    { header: 'Method', accessor: 'verificationMethod' }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="page-title">Handover History</h1>
      <DataTable 
        columns={columns} 
        data={handovers} 
        keyField="_id" 
        emptyMessage="No handover history found." 
      />
    </div>
  );
};

export default HandoverHistory;
