import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(credentials);
      toast.success('Logged in successfully!');
      navigate(`/${user.role}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', textAlign: 'center' }}>
        Welcome Back
      </h2>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <Button 
          type="submit" 
          variant="primary" 
          className="w-full" 
          disabled={loading}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: '500' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
