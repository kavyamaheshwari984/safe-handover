import React, { useState, useEffect } from 'react';
import { auditLogApi } from '../../api/auditLogApi';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await auditLogApi.getAuditLogs();
        setLogs(res.logs);
      } catch (error) {
        toast.error('Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const columns = [
    { header: 'Time', cell: (row) => new Date(row.performedAt).toLocaleString() },
    { header: 'Action', cell: (row) => <StatusBadge status={row.action.replace(/_/g, ' ')} /> },
    { header: 'Performed By', cell: (row) => row.performedBy?.name || 'Unknown' },
    { header: 'Child', cell: (row) => row.child?.name || '-' },
    { header: 'Details', accessor: 'details' }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="page-title">Audit Logs</h1>
      <DataTable 
        columns={columns} 
        data={logs} 
        keyField="_id" 
        emptyMessage="No audit logs found." 
      />
    </div>
  );
};

export default AuditLogs;
