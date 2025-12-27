import React from 'react';
import { FaUser, FaFileInvoice, FaCalendarAlt, FaPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const EmployeeDashboard = () => {
  const employee = {
    name: 'John Doe',
    department: 'Engineering',
    designation: 'Frontend Developer',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  };

  const quickAccessLinks = [
    { id: 1, title: 'My Profile', icon: <FaUser className="text-3xl text-blue-500" />, link: '/employee/profile' },
    { id: 2, title: 'My Payslips', icon: <FaFileInvoice className="text-3xl text-green-500" />, link: '/employee/payslip' },
    { id: 3, title: 'My Attendance', icon: <FaCalendarAlt className="text-3xl text-yellow-500" />, link: '/employee/attendance' },
    { id: 4, title: 'Apply for Leave', icon: <FaPlane className="text-3xl text-red-500" />, link: '/employee/leave' },
  ];

  const recentPayslips = [
    { id: 1, month: 'November 2025', year: 2025, amount: '$5,300' },
    { id: 2, month: 'October 2025', year: 2025, amount: '$5,250' },
    { id: 3, month: 'September 2025', year: 2025, amount: '$5,280' },
  ];

  const upcomingHolidays = [
    { id: 1, name: 'Christmas Day', date: 'December 25, 2025' },
    { id: 2, name: 'New Year\'s Day', date: 'January 1, 2026' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 flex items-center gap-6">
        <img src={employee.avatar} alt={employee.name} className="w-24 h-24 rounded-full border-4 border-indigo-200" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {employee.name}!</h1>
          <p className="text-gray-600">{employee.designation}, {employee.department}</p>
        </div>
      </div>

      {/* Quick Access Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickAccessLinks.map(item => (
          <Link key={item.id} to={item.link}>
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center transition-transform transform hover:scale-105">
              <div className="mb-4">{item.icon}</div>
              <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payslips */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Payslips</h2>
          <ul className="divide-y divide-gray-200">
            {recentPayslips.map(payslip => (
              <li key={payslip.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{payslip.month} {payslip.year}</p>
                  <p className="text-sm text-gray-500">Amount: {payslip.amount}</p>
                </div>
                <button className="text-indigo-600 hover:underline">View Details</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Upcoming Holidays */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Holidays</h2>
          <ul className="divide-y divide-gray-200">
            {upcomingHolidays.map(holiday => (
              <li key={holiday.id} className="py-3">
                <p className="font-semibold text-gray-800">{holiday.name}</p>
                <p className="text-sm text-gray-500">{holiday.date}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;