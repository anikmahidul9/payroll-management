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
import AttendancePage from './pages/admin/AttendancePage';
import DeductionsPage from './pages/admin/DeductionsPage';
import EmployeesPage from './pages/admin/EmployeesPage';
import AdminEmployeeProfilePage from './pages/admin/EmployeeProfilePage';
import PayrollPage from './pages/admin/PayrollPage';
import ReportsPage from './pages/admin/ReportsPage';

import HRLayout from './components/hr/Layout';
import HRAttendancePage from './pages/hr/AttendancePage';
import HRDeductionsPage from './pages/hr/DeductionsPage';
import HREmployeesPage from './pages/hr/EmployeesPage';
import HREmployeeProfilePage from './pages/hr/EmployeeProfilePage';
import HRPayrollPage from './pages/hr/PayrollPage';
import HRReportsPage from './pages/hr/ReportsPage';

import EmployeeLayout from './components/employee/Layout';
import EmpProfilePage from './pages/employee/ProfilePage';
import EmployeePayslipPage from './pages/employee/PayslipPage';
import EmployeeAttendancePage from './pages/employee/AttendancePage';
import EmployeeLeavePage from './pages/employee/LeavePage';

import SettingsPage from './pages/admin/SettingsPage';


import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <Layout>
              <AdminDashboard />
            </Layout>
          }
        />
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
              <AdminEmployeeProfilePage />
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
          path="/admin/payroll"
          element={
            <Layout>
              <PayrollPage />
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
            <HRLayout>
              <HRDashboard />
            </HRLayout>
          }
        />
        <Route
          path="/hr/employees"
          element={
            <HRLayout>
              <HREmployeesPage />
            </HRLayout>
          }
        />
        <Route
          path="/hr/employees/:employeeId"
          element={
            <HRLayout>
              <HREmployeeProfilePage />
            </HRLayout>
          }
        />
        <Route
          path="/hr/attendance"
          element={
            <HRLayout>
              <HRAttendancePage />
            </HRLayout>
          }
        />
        <Route
          path="/hr/payroll"
          element={
            <HRLayout>
              <HRPayrollPage />
            </HRLayout>
          }
        />
        <Route
          path="/hr/deductions"
          element={
            <HRLayout>
              <HRDeductionsPage />
            </HRLayout>
          }
        />
        <Route
          path="/hr/reports"
          element={
            <HRLayout>
              <HRReportsPage />
            </HRLayout>
          }
        />
        <Route
          path="/hr/settings"
          element={
            <HRLayout>
              <SettingsPage />
            </HRLayout>
          }
        />
        <Route
          path="/employee/dashboard"
          element={
            <EmployeeLayout>
              <EmployeeDashboard />
            </EmployeeLayout>
          }
        />
        <Route
          path="/employee/profile"
          element={
            <EmployeeLayout>
              <EmpProfilePage />
            </EmployeeLayout>
          }
        />
        <Route
          path="/employee/payslip"
          element={
            <EmployeeLayout>
              <EmployeePayslipPage />
            </EmployeeLayout>
          }
        />
        <Route
          path="/employee/attendance"
          element={
            <EmployeeLayout>
              <EmployeeAttendancePage />
            </EmployeeLayout>
          }
        />
        <Route
          path="/employee/leave"
          element={
            <EmployeeLayout>
              <EmployeeLeavePage />
            </EmployeeLayout>
          }
        />
        {/* Logout Route */}
        <Route path="/logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
