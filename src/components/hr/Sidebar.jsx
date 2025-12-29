import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Transition, Dialog } from '@headlessui/react';
import {
  FaTachometerAlt,
  FaUsers,
  FaFileInvoiceDollar,
  FaChartBar,
  FaCog,
  FaCalendarCheck,
  FaMinusCircle,
  FaSignOutAlt,
  FaTimes,
  FaCalendarAlt, // Added FaCalendarAlt for Leave Requests
} from 'react-icons/fa';
import logo from '../../assets/logo.png';

const SidebarContent = () => (
  <div className="flex h-full flex-col justify-between bg-white shadow-lg">
    <div className="px-4 py-6">
      <div className="flex items-center justify-center mb-8">
        <img src={logo} alt="Company Logo" className="h-12 w-auto" />
      </div>
      <nav aria-label="Main Nav" className="flex flex-col space-y-1">
        {/* Navigation Links */}
        <NavLink to="/hr/dashboard" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-indigo-600 ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''}` }>
          <FaTachometerAlt className="h-5 w-5" />
          <span className="text-sm">Dashboard</span>
        </NavLink>
        <NavLink to="/hr/employees" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-indigo-600 ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''}` }>
          <FaUsers className="h-5 w-5" />
          <span className="text-sm">Employees</span>
        </NavLink>
        <NavLink to="/hr/payroll" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-indigo-600 ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''}` }>
          <FaFileInvoiceDollar className="h-5 w-5" />
          <span className="text-sm">Payroll</span>
        </NavLink>
        <NavLink to="/hr/attendance" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-indigo-600 ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''}` }>
          <FaCalendarCheck className="h-5 w-5" />
          <span className="text-sm">Attendance</span>
        </NavLink>
        <NavLink to="/hr/leave-requests" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-indigo-600 ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''}` }>
          <FaCalendarAlt className="h-5 w-5" />
          <span className="text-sm">Leave Requests</span>
        </NavLink>
        <NavLink to="/hr/deductions" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-indigo-600 ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''}` }>
          <FaMinusCircle className="h-5 w-5" />
          <span className="text-sm">Deductions</span>
        </NavLink>
        <NavLink to="/hr/reports" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-indigo-600 ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''}` }>
          <FaChartBar className="h-5 w-5" />
          <span className="text-sm">Reports</span>
        </NavLink>
        <NavLink to="/hr/settings" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-indigo-600 ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''}` }>
          <FaCog className="h-5 w-5" />
          <span className="text-sm">Settings</span>
        </NavLink>
      </nav>
    </div>
    <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
      <NavLink to="/logout" className="flex items-center gap-4 bg-white p-4 hover:bg-gray-50 transition-colors duration-200">
        <FaSignOutAlt className="h-5 w-5" />
        <span className="text-sm font-medium text-gray-900">Logout</span>
      </NavLink>
    </div>
  </div>
);

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Sidebar */}
      <Transition show={isSidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={toggleSidebar}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="w-64">
                  <SidebarContent />
                </div>
                <button
                  type="button"
                  className="absolute top-0 right-0 -mr-12 pt-2"
                  onClick={toggleSidebar}
                >
                  <span className="sr-only">Close sidebar</span>
                  <FaTimes className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;

