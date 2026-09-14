import React, { useState, useEffect } from 'react';
import { pickupRequestApi } from '../../api/pickupRequestApi';
import { childrenApi } from '../../api/childrenApi';
import DataTable from '../../components/DataTable';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const PickupRequests = () => {
  const [requests, setRequests] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [childId, setChildId] = useState('');

  const fetchData = async () => {
    try {
      const [reqRes, childRes] = await Promise.all([
        pickupRequestApi.getRequests(),
        childrenApi.getAllChildren()
      ]);
      setRequests(reqRes.requests);
      setChildren(childRes.children);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      await pickupRequestApi.createRequest(childId);
      toast.success('Pickup request created successfully');
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create request');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await pickupRequestApi.updateStatus(id, status);
      toast.success(`Request ${status.toLowerCase()} successfully`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to update status`);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      try {
        await pickupRequestApi.cancelRequest(id);
        toast.success('Request cancelled');
        fetchData();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to cancel');
      }
    }
  };

  const columns = [
    { header: 'Child', cell: (row) => row.child?.name },
    { header: 'Requested By', cell: (row) => row.requestedBy?.name },
    { header: 'Time', cell: (row) => new Date(row.requestedAt).toLocaleString() },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex-gap">
          {row.status === 'PENDING' && (
            <>
              <Button variant="outline-primary" onClick={() => handleStatusChange(row._id, 'APPROVED')}>Approve</Button>
              <Button variant="danger" onClick={() => handleStatusChange(row._id, 'REJECTED')}>Reject</Button>
              <Button variant="danger" onClick={() => handleCancel(row._id)}>Cancel</Button>
            </>
          )}
          {row.status === 'APPROVED' && (
             <Button variant="danger" onClick={() => handleCancel(row._id)}>Cancel</Button>
          )}
        </div>
      )
    }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title" style={{ marginBottom: 0 }}>Pickup Requests</h1>
        <Button onClick={() => setIsModalOpen(true)}>New Pickup Request</Button>
      </div>

      <DataTable 
        columns={columns} 
        data={requests} 
        keyField="_id" 
        emptyMessage="No pickup requests found." 
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Pickup Request">
        <form onSubmit={handleCreateRequest}>
          <div className="form-group">
            <label className="form-label">Select Child</label>
            <select className="form-input" value={childId} onChange={e => setChildId(e.target.value)} required>
              <option value="">-- Select --</option>
              {children.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit">Create Request</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PickupRequests;
