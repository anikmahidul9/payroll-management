import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaPlane } from 'react-icons/fa';

const attendanceData = [
  { date: '2025-12-01', status: 'Present' },
  { date: '2025-12-02', status: 'Present' },
  { date: '2025-12-03', status: 'Absent' },
  { date: '2025-12-04', status: 'Present' },
  { date: '2025-12-05', status: 'Leave' },
  // Add more data...
];

const getStatusIcon = (status) => {
  switch (status) {
    case 'Present':
      return <FaCheckCircle className="text-green-500" />;
    case 'Absent':
      return <FaTimesCircle className="text-red-500" />;
    case 'Leave':
      return <FaPlane className="text-yellow-500" />;
    default:
      return null;
  }
};

const AttendancePage = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Attendance</h1>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendanceData.map((record, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 flex items-center gap-2">
                  {getStatusIcon(record.status)}
                  <span>{record.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePage;
