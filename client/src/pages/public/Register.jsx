import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'parent'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(userData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', textAlign: 'center' }}>
        Create an Account
      </h2>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Full Name"
          name="name"
          value={userData.name}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={userData.email}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          value={userData.password}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Phone Number"
          name="phone"
          value={userData.phone}
          onChange={handleChange}
          required
        />
        <div className="form-group">
          <label className="form-label">Role</label>
          <select 
            name="role" 
            className="form-input" 
            value={userData.role} 
            onChange={handleChange}
          >
            <option value="parent">Parent</option>
            <option value="guardian">Guardian</option>
          </select>
        </div>
        
        <Button 
          type="submit" 
          variant="primary" 
          className="w-full" 
          disabled={loading}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </form>
      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: '500' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
