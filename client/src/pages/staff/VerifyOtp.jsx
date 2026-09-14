import React, { useState } from 'react';
import { otpApi } from '../../api/otpApi';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

const VerifyOtp = () => {
  const [formData, setFormData] = useState({ pickupRequestId: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [verifiedHandover, setVerifiedHandover] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setVerifiedHandover(null);
    try {
      const res = await otpApi.verifyOTP(formData.pickupRequestId, formData.otp);
      toast.success('OTP Verified Successfully! Handover complete.');
      setVerifiedHandover(res.handover);
      setFormData({ pickupRequestId: '', otp: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Verify OTP</h1>
      
      <div style={{ maxWidth: '500px', backgroundColor: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Pickup Request ID"
            name="pickupRequestId"
            value={formData.pickupRequestId}
            onChange={handleChange}
            placeholder="Paste the ID here"
            required
          />
          <FormInput
            label="6-Digit OTP"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            placeholder="Enter OTP"
            required
          />
          <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Handover'}
          </Button>
        </form>

        {verifiedHandover && (
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--color-success-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-success)' }}>
            <h3 style={{ color: 'var(--color-success)', marginBottom: '0.5rem' }}>Handover Successful</h3>
            <p><strong>Child ID:</strong> {verifiedHandover.child}</p>
            <p><strong>Picked Up By ID:</strong> {verifiedHandover.pickedUpBy}</p>
            <p><strong>Time:</strong> {new Date(verifiedHandover.handedOverAt).toLocaleTimeString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;
