import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaFileInvoiceDollar,
  FaChartBar,
  FaCog, // Added for Settings
} from 'react-icons/fa';
import logo from '../../assets/logo.png'; // Import the logo

const Sidebar = () => {
  return (
    <div className="flex h-screen flex-col justify-between border-e bg-white w-64 shadow-md">
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
        <a
          href="#"
          className="flex items-center gap-4 bg-white p-4 hover:bg-gray-50 transition-colors duration-200"
        >
          <img
            alt="User Avatar"
            src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            className="size-10 rounded-full object-cover border-2 border-indigo-200"
          />
          <div>
            <p className="text-sm">
              <strong className="block font-medium text-gray-900">Eric Frusciante</strong>
              <span className="text-gray-600">eric@frusciante.com</span>
            </p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
