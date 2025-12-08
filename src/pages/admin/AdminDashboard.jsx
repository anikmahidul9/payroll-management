import React from 'react';
import { FaUsers, FaBuilding, FaPlaneDeparture, FaMoneyBillWave, FaCog, FaPlusCircle, FaEdit, FaCheckCircle, FaUserPlus, FaUserMinus, FaCalendarAlt, FaBriefcase, FaPercent } from 'react-icons/fa';

const AdminDashboard = () => {
  const cardData = [
    {
      id: 1,
      title: 'Total Employees',
      value: '250',
      icon: <FaUsers className="text-4xl text-blue-500" />,
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
    },
    {
      id: 2,
      title: 'Departments',
      value: '15',
      icon: <FaBuilding className="text-4xl text-green-500" />,
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
    },
    {
      id: 3,
      title: 'Pending Leaves',
      value: '12',
      icon: <FaPlaneDeparture className="text-4xl text-yellow-500" />,
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
    },
    {
      id: 4,
      title: 'Total Salary Paid',
      value: '$500,000',
      icon: <FaMoneyBillWave className="text-4xl text-red-500" />,
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
    },
  ];

  const quickActions = [
    {
      id: 1,
      name: 'Generate Payroll',
      icon: <FaPlusCircle className="text-xl" />,
      link: '#',
      color: 'bg-indigo-600 hover:bg-indigo-700',
    },
    {
      id: 2,
      name: 'Manage Employees',
      icon: <FaEdit className="text-xl" />,
      link: '#',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      id: 3,
      name: 'Approve Leaves',
      icon: <FaCheckCircle className="text-xl" />,
      link: '#',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      id: 4,
      name: 'Payroll Settings',
      icon: <FaCog className="text-xl" />,
      link: '#',
      color: 'bg-gray-600 hover:bg-gray-700',
    },
  ];

  const recentActivities = [
    { id: 1, text: 'Generated payroll for November 2025', time: '2 hours ago' },
    { id: 2, text: 'Approved leave request for John Doe', time: '1 day ago' },
    { id: 3, text: 'Added new employee Jane Smith', time: '3 days ago' },
  ];

  const upcomingPayrollDates = [
    { id: 1, date: 'Dec 15, 2025', description: 'Bi-weekly payroll run' },
    { id: 2, date: 'Dec 30, 2025', description: 'Monthly salary disbursement' },
  ];

  const departmentEmployeeCount = [
    { id: 1, department: 'Engineering', count: 120 },
    { id: 2, department: 'Human Resources', count: 10 },
    { id: 3, department: 'Marketing', count: 30 },
    { id: 4, department: 'Sales', count: 50 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardData.map((card) => (
          <div
            key={card.id}
            className={`${card.bgColor} rounded-lg shadow-lg p-6 flex items-center justify-between transition-transform transform hover:scale-105`}
          >
            <div className="flex-shrink-0">
              {card.icon}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Access Buttons */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Access</h2>
          <div className="flex flex-col space-y-4">
            {quickActions.map((action) => (
              <a
                key={action.id}
                href={action.link}
                className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${action.color}`}
              >
                {action.icon}
                <span>{action.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Payroll Overview Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Payroll Overview</h2>
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
            [Chart Placeholder: Monthly Payroll Expenditure]
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Employee Onboarding/Offboarding Status */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Employee Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaUserPlus className="text-green-500 text-xl" />
                <p className="text-gray-700">New Hires This Month:</p>
              </div>
              <span className="font-bold text-lg">5</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaUserMinus className="text-red-500 text-xl" />
                <p className="text-gray-700">Departures This Month:</p>
              </div>
              <span className="font-bold text-lg">2</span>
            </div>
          </div>
        </div>

        {/* Upcoming Payroll Dates */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Payrolls</h2>
          <ul className="divide-y divide-gray-200">
            {upcomingPayrollDates.map((item) => (
              <li key={item.id} className="py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-purple-500" />
                  <p className="text-gray-700">{item.description}</p>
                </div>
                <span className="font-semibold text-gray-600">{item.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Department-wise Employee Count */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Employees by Department</h2>
          <ul className="divide-y divide-gray-200">
            {departmentEmployeeCount.map((item) => (
              <li key={item.id} className="py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FaBuilding className="text-blue-400" />
                  <p className="text-gray-700">{item.department}</p>
                </div>
                <span className="font-semibold text-gray-600">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits & Deductions Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Benefits & Deductions</h2>
          <div className="h-32 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
            [Summary Placeholder: Health, Retirement, Taxes]
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activities</h2>
        <ul className="divide-y divide-gray-200">
          {recentActivities.map((activity) => (
            <li key={activity.id} className="py-3 flex justify-between items-center">
              <p className="text-gray-700">{activity.text}</p>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
