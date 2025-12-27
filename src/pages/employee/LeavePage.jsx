import React from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const leaveHistory = [
  { id: 1, type: 'Annual Leave', from: '2025-10-15', to: '2025-10-20', status: 'Approved' },
  { id: 2, type: 'Sick Leave', from: '2025-11-05', to: '2025-11-05', status: 'Approved' },
  { id: 3, type: 'Casual Leave', from: '2025-12-22', to: '2025-12-23', status: 'Pending' },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const LeavePage = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Leave Management</h1>

      {/* Apply for Leave Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Apply for Leave</h2>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label htmlFor="leave-type" className="block text-sm font-medium text-gray-700">Leave Type</label>
              <select id="leave-type" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option>Select Leave Type</option>
                <option>Annual Leave</option>
                <option>Sick Leave</option>
                <option>Casual Leave</option>
                <option>Unpaid Leave</option>
              </select>
            </div>
            <div>
              <label htmlFor="from-date" className="block text-sm font-medium text-gray-700">From Date</label>
              <input type="date" id="from-date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="to-date" className="block text-sm font-medium text-gray-700">To Date</label>
              <input type="date" id="to-date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
              <textarea id="reason" rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
            </div>
          </div>
          <button type="submit" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">
            <FaPaperPlane />
            <span>Submit Request</span>
          </button>
        </form>
      </div>

      {/* Leave History */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-800 p-6">Leave History</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaveHistory.map(leave => (
              <tr key={leave.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{leave.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{leave.from}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{leave.to}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                    {leave.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeavePage;
