import React, { useState, useEffect } from 'react';
import { pickupRequestApi } from '../../api/pickupRequestApi';
import { otpApi } from '../../api/otpApi';
import DataTable from '../../components/DataTable';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const OtpManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await pickupRequestApi.getRequests();
      // Filter for approved requests that might need OTP management
      const approvedRequests = res.requests.filter(r => r.status === 'APPROVED');
      setRequests(approvedRequests);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleGenerateOTP = async (id) => {
    try {
      const res = await otpApi.generateOTP(id);
      toast.success('OTP generated successfully');
      // Update local state with OTP
      setRequests(requests.map(r => r._id === id ? { ...r, otp: res.request.otp, otpExpiresAt: res.request.otpExpiresAt } : r));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate OTP');
    }
  };

  const handleResendOTP = async (id) => {
    try {
      const res = await otpApi.resendOTP(id);
      toast.success('OTP resent successfully');
      setRequests(requests.map(r => r._id === id ? { ...r, otp: res.request.otp, otpExpiresAt: res.request.otpExpiresAt } : r));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const handleInvalidateOTP = async (id) => {
    if (window.confirm('Are you sure you want to invalidate this OTP?')) {
      try {
        await otpApi.invalidateOTP(id);
        toast.success('OTP invalidated');
        setRequests(requests.map(r => r._id === id ? { ...r, otp: undefined, otpExpiresAt: undefined } : r));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to invalidate OTP');
      }
    }
  };

  const columns = [
    { header: 'Child', cell: (row) => row.child?.name },
    { header: 'Requested By', cell: (row) => row.requestedBy?.name },
    { 
      header: 'OTP', 
      cell: (row) => row.otp ? (
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '2px', color: 'var(--color-primary)' }}>
          {row.otp}
        </span>
      ) : (
        <span style={{ color: 'var(--color-text-secondary)' }}>Not Generated</span>
      )
    },
    { 
      header: 'Expires At', 
      cell: (row) => row.otpExpiresAt ? new Date(row.otpExpiresAt).toLocaleTimeString() : '-' 
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex-gap">
          {!row.otp ? (
            <Button variant="primary" onClick={() => handleGenerateOTP(row._id)}>Generate OTP</Button>
          ) : (
            <>
              <Button variant="outline-primary" onClick={() => handleResendOTP(row._id)}>Resend</Button>
              <Button variant="danger" onClick={() => handleInvalidateOTP(row._id)}>Invalidate</Button>
            </>
          )}
        </div>
      )
    }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="page-title">OTP Management</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
        Manage OTPs for approved pickup requests. Give this OTP to the staff for verification.
      </p>

      <DataTable 
        columns={columns} 
        data={requests} 
        keyField="_id" 
        emptyMessage="No approved pickup requests available for OTP generation." 
      />
    </div>
  );
};

export default OtpManagement;
