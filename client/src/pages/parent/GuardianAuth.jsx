import React, { useState, useEffect } from 'react';
import { guardianAuthApi } from '../../api/guardianAuthApi';
import { authApi } from '../../api/authApi';
import { childrenApi } from '../../api/childrenApi';
import DataTable from '../../components/DataTable';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import FormInput from '../../components/FormInput';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const GuardianAuth = () => {
  const [authorizations, setAuthorizations] = useState([]);
  const [children, setChildren] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ guardianId: '', childId: '', relationship: '', validUntil: '' });

  const fetchData = async () => {
    try {
      const [authRes, childRes, guardianRes] = await Promise.all([
        guardianAuthApi.getAuthorizations(),
        childrenApi.getAllChildren(),
        authApi.getGuardians()
      ]);
      setAuthorizations(authRes.authorizations);
      setChildren(childRes.children);
      setGuardians(guardianRes.guardians);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    setFormData({ guardianId: '', childId: '', relationship: '', validUntil: '' });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await guardianAuthApi.createAuthorization(formData);
      toast.success('Authorization created successfully');
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await guardianAuthApi.updateStatus(id, status);
      toast.success(`Status updated to ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to revoke this authorization?')) {
      try {
        await guardianAuthApi.deleteAuthorization(id);
        toast.success('Authorization revoked');
        fetchData();
      } catch (error) {
        toast.error('Failed to revoke');
      }
    }
  };

  const columns = [
    { header: 'Child', cell: (row) => row.child?.name },
    { header: 'Guardian', cell: (row) => `${row.guardian?.name} (${row.guardian?.email})` },
    { header: 'Relationship', accessor: 'relationship' },
    { header: 'Valid Until', cell: (row) => new Date(row.validUntil).toLocaleDateString() },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex-gap">
          {row.status === 'pending' && (
            <Button variant="outline-primary" onClick={() => handleStatusChange(row._id, 'approved')}>Approve</Button>
          )}
          {row.status === 'approved' && (
            <Button variant="danger" onClick={() => handleStatusChange(row._id, 'rejected')}>Reject</Button>
          )}
          <Button variant="danger" onClick={() => handleDelete(row._id)}>Revoke</Button>
        </div>
      )
    }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title" style={{ marginBottom: 0 }}>Guardian Authorizations</h1>
        <Button onClick={handleOpenModal}>Authorize Guardian</Button>
      </div>

      <DataTable 
        columns={columns} 
        data={authorizations} 
        keyField="_id" 
        emptyMessage="No guardian authorizations found." 
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Authorize Guardian">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Child</label>
            <select name="childId" className="form-input" value={formData.childId} onChange={handleChange} required>
              <option value="">Select Child</option>
              {children.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="guardianId">Guardian</label>
            <select id="guardianId" name="guardianId" className="form-input" value={formData.guardianId} onChange={handleChange} required>
              <option value="">Select Guardian</option>
              {guardians.map(guardian => (
                <option key={guardian._id} value={guardian._id}>
                  {guardian.name} ({guardian.email})
                </option>
              ))}
            </select>
            {guardians.length === 0 && (
              <div className="form-help">Register a guardian account before authorizing one.</div>
            )}
          </div>
          <FormInput label="Relationship (e.g. Uncle, Grandparent)" name="relationship" value={formData.relationship} onChange={handleChange} required />
          <FormInput label="Valid Until" name="validUntil" type="date" value={formData.validUntil} onChange={handleChange} required />
          <div className="flex justify-end mt-4">
            <Button type="submit">Authorize</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GuardianAuth;
