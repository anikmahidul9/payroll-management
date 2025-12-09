import React from 'react';
import { FaUsers, FaBuilding, FaPlaneDeparture, FaMoneyBillWave, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminDashboard = () => {
  const cardData = [
    { id: 1, title: 'Total Employees', value: '250', icon: <FaUsers className="text-4xl text-blue-500" /> },
    { id: 2, title: 'Departments', value: '15', icon: <FaBuilding className="text-4xl text-green-500" /> },
    { id: 3, title: 'Pending Leaves', value: '12', icon: <FaPlaneDeparture className="text-4xl text-yellow-500" /> },
    { id: 4, title: 'Total Salary Paid', value: '500,000', icon: <FaMoneyBillWave className="text-4xl text-red-500" /> },
  ];

  const payrollData = [
    { month: 'Jan', expense: 48000 }, { month: 'Feb', expense: 52000 },
    { month: 'Mar', expense: 45000 }, { month: 'Apr', expense: 55000 },
    { month: 'May', expense: 58000 }, { month: 'Jun', expense: 62000 },
  ];

  const attendanceData = [
    { day: 'Mon', present: 95 }, { day: 'Tue', present: 92 },
    { day: 'Wed', present: 98 }, { day: 'Thu', present: 88 },
    { day: 'Fri', present: 91 }, { day: 'Sat', present: 45 },
  ];
  
  const upcomingEvents = [
    { id: 1, title: 'Company Town Hall', date: 'Dec 15, 2025', time: '10:00 AM' },
    { id: 2, title: 'End of Year Party', date: 'Dec 20, 2025', time: '7:00 PM' },
    { id: 3, title: 'Holiday Office Closure', date: 'Dec 24, 2025', time: 'All Day' },
  ];

  return (
    <div className="p-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardData.map((card) => (
          <div key={card.id} className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-between transition-transform transform hover:scale-105">
            <div className="flex-shrink-0">{card.icon}</div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <p className="text-3xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: Charts and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Charts */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Payroll Expense Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Payroll Expense</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={payrollData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="expense" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance Overview Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Attendance Overview</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="present" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Events */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
          <ul className="divide-y divide-gray-200">
            {upcomingEvents.map((event) => (
              <li key={event.id} className="py-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <FaCalendarAlt className="text-xl text-indigo-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{event.title}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaClock />
                      <span>{event.date} at {event.time}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
