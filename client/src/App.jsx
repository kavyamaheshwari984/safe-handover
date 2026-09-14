import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Parent Pages
import ParentDashboard from './pages/parent/ParentDashboard';
import MyChildren from './pages/parent/MyChildren';
import GuardianAuth from './pages/parent/GuardianAuth';
import PickupRequests from './pages/parent/PickupRequests';
import OtpManagement from './pages/parent/OtpManagement';
import HandoverHistory from './pages/parent/HandoverHistory';
import AuditLogs from './pages/parent/AuditLogs';

// Guardian Pages
import GuardianDashboard from './pages/guardian/GuardianDashboard';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import VerifyOtp from './pages/staff/VerifyOtp';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Parent Routes */}
          <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/parent" element={<ParentDashboard />} />
              <Route path="/parent/children" element={<MyChildren />} />
              <Route path="/parent/guardians" element={<GuardianAuth />} />
              <Route path="/parent/pickup-requests" element={<PickupRequests />} />
              <Route path="/parent/otp" element={<OtpManagement />} />
              <Route path="/parent/handovers" element={<HandoverHistory />} />
              <Route path="/parent/audit-logs" element={<AuditLogs />} />
            </Route>
          </Route>

          {/* Guardian Routes */}
          <Route element={<ProtectedRoute allowedRoles={['guardian']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/guardian" element={<GuardianDashboard />} />
              <Route path="/guardian/pickup-requests" element={<PickupRequests />} />
              <Route path="/guardian/handovers" element={<HandoverHistory />} />
              <Route path="/guardian/audit-logs" element={<AuditLogs />} />
            </Route>
          </Route>

          {/* Staff Routes */}
          <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/staff" element={<StaffDashboard />} />
              <Route path="/staff/verify-otp" element={<VerifyOtp />} />
              <Route path="/staff/handovers" element={<HandoverHistory />} />
              <Route path="/staff/audit-logs" element={<AuditLogs />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/children" element={<MyChildren />} />
              <Route path="/admin/guardians" element={<GuardianAuth />} />
              <Route path="/admin/pickup-requests" element={<PickupRequests />} />
              <Route path="/admin/otp" element={<OtpManagement />} />
              <Route path="/admin/handovers" element={<HandoverHistory />} />
              <Route path="/admin/audit-logs" element={<AuditLogs />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
