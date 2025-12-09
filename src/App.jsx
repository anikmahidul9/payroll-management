import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/admin/Layout';
import AdminDashboard from './pages/admin/AdminDashboard';
import HRDashboard from './pages/hr/HRDashboard';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import AttendancePage from './pages/admin/AttendancePage'; // New Import
import DeductionsPage from './pages/admin/DeductionsPage'; // New Import
import EmployeesPage from './pages/admin/EmployeesPage'; // New Import

import EmployeeProfilePage from './pages/admin/EmployeeProfilePage'; // New Import

// Placeholder components for other admin sections
const ReportsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-800">Reports Overview</h1>
    <p className="mt-4 text-gray-600">This page will display various reports.</p>
  </div>
);
const SettingsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-800">Admin Settings</h1>
    <p className="mt-4 text-gray-600">This page will manage application settings.</p>
  </div>
);


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <Layout>
              <AdminDashboard />
            </Layout>
          }
        />
        {/* New Admin Routes */}
        <Route
          path="/admin/employees"
          element={
            <Layout>
              <EmployeesPage />
            </Layout>
          }
        />
        <Route
          path="/admin/employees/:employeeId"
          element={
            <Layout>
              <EmployeeProfilePage />
            </Layout>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <Layout>
              <AttendancePage />
            </Layout>
          }
        />
        <Route
          path="/admin/deductions"
          element={
            <Layout>
              <DeductionsPage />
            </Layout>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <Layout>
              <ReportsPage />
            </Layout>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <Layout>
              <SettingsPage />
            </Layout>
          }
        />
        <Route
          path="/hr/dashboard"
          element={
            <Layout>
              <HRDashboard />
            </Layout>
          }
        />
        <Route
          path="/employee/dashboard"
          element={
            <Layout>
              <EmployeeDashboard />
            </Layout>
          }
        />
        {/* Logout Route */}
        <Route path="/logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
