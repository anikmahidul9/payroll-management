import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaFileInvoiceDollar,
  FaChartBar,
  FaCog,
  FaCalendarCheck, // Added for Attendance
  FaMinusCircle,    // Added for Deductions
  FaSignOutAlt,   // Added for Logout
} from 'react-icons/fa';
import logo from '../../assets/logo.png'; // Import the logo

const Sidebar = () => {
  return (
    <div className="flex h-screen flex-col justify-between bg-white w-64 shadow-md">
      <div className="px-4 py-6">
        {/* Logo Section */}
        <div className="flex items-center justify-center mb-8">
          <img src={logo} alt="Company Logo" className="h-12 w-auto" />
        </div>

        <nav aria-label="Main Nav" className="flex flex-col space-y-1">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-indigo-600 ${
                isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''
              }`
            }
          >
            <FaTachometerAlt className="h-5 w-5" />
            <span className="text-sm"> Dashboard </span>
          </NavLink>

          <NavLink
            to="/admin/employees"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-indigo-600 ${
                isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''
              }`
            }
          >
            <FaUsers className="h-5 w-5" />
            <span className="text-sm"> Employees </span>
          </NavLink>

          <NavLink
            to="/admin/payroll"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-indigo-600 ${
                isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''
              }`
            }
          >
            <FaFileInvoiceDollar className="h-5 w-5" />
            <span className="text-sm"> Payroll </span>
          </NavLink>

          {/* New Attendance Link */}
          <NavLink
            to="/admin/attendance"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-indigo-600 ${
                isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''
              }`
            }
          >
            <FaCalendarCheck className="h-5 w-5" />
            <span className="text-sm"> Attendance </span>
          </NavLink>

          {/* New Deductions Link */}
          <NavLink
            to="/admin/deductions"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-indigo-600 ${
                isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''
              }`
            }
          >
            <FaMinusCircle className="h-5 w-5" />
            <span className="text-sm"> Deductions </span>
          </NavLink>

          <NavLink
            to="/admin/reports"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-indigo-600 ${
                isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''
              }`
            }
          >
            <FaChartBar className="h-5 w-5" />
            <span className="text-sm"> Reports </span>
          </NavLink>

          {/* New Settings Link */}
          <NavLink
            to="/admin/settings" // Placeholder for settings page
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-indigo-600 ${
                isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''
              }`
            }
          >
            <FaCog className="h-5 w-5" />
            <span className="text-sm"> Settings </span>
          </NavLink>
        </nav>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
        {/* Logout Link */}
        <NavLink
          to="/logout" // Assuming a logout route
          className="flex items-center gap-4 bg-white p-4 hover:bg-gray-50 transition-colors duration-200"
        >
          <FaSignOutAlt className="h-5 w-5 text-gray-700" />
          <span className="text-sm font-medium text-gray-900"> Logout </span>
        </NavLink>
      </div>
    </div>
  );
}
export default Sidebar;
