import React, { useState, useEffect } from 'react';
import { childrenApi } from '../../api/childrenApi';
import DataTable from '../../components/DataTable';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import FormInput from '../../components/FormInput';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const MyChildren = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', dateOfBirth: '', className: '', rollNo: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchChildren = async () => {
    try {
      const res = await childrenApi.getAllChildren();
      setChildren(res.children);
    } catch (error) {
      toast.error('Failed to load children');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleOpenModal = (child = null) => {
    if (child) {
      setEditingId(child._id);
      // Format date for input field (YYYY-MM-DD)
      const dob = new Date(child.dateOfBirth).toISOString().split('T')[0];
      setFormData({ name: child.name, dateOfBirth: dob, className: child.className, rollNo: child.rollNo });
    } else {
      setEditingId(null);
      setFormData({ name: '', dateOfBirth: '', className: '', rollNo: '' });
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await childrenApi.updateChild(editingId, formData);
        toast.success('Child updated successfully');
      } else {
        await childrenApi.createChild(formData);
        toast.success('Child added successfully');
      }
      setIsModalOpen(false);
      fetchChildren();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this child?')) {
      try {
        await childrenApi.deleteChild(id);
        toast.success('Child deleted successfully');
        fetchChildren();
      } catch (error) {
        toast.error('Failed to delete child');
      }
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Class', accessor: 'className' },
    { header: 'Roll No', accessor: 'rollNo' },
    { 
      header: 'DOB', 
      cell: (row) => new Date(row.dateOfBirth).toLocaleDateString() 
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex-gap">
          <Button variant="outline-primary" onClick={() => handleOpenModal(row)}>Edit</Button>
          <Button variant="danger" onClick={() => handleDelete(row._id)}>Delete</Button>
        </div>
      )
    }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title" style={{ marginBottom: 0 }}>My Children</h1>
        <Button onClick={() => handleOpenModal()}>Add Child</Button>
      </div>

      <DataTable 
        columns={columns} 
        data={children} 
        keyField="_id" 
        emptyMessage="You haven't added any children yet." 
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? 'Edit Child' : 'Add Child'}
      >
        <form onSubmit={handleSubmit}>
          <FormInput label="Name" name="name" value={formData.name} onChange={handleChange} required />
          <FormInput label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
          <FormInput label="Class Name" name="className" value={formData.className} onChange={handleChange} required />
          <FormInput label="Roll Number" name="rollNo" type="number" value={formData.rollNo} onChange={handleChange} required />
          <div className="flex justify-end mt-4">
            <Button type="submit">{editingId ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyChildren;
