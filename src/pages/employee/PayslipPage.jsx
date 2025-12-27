import React from 'react';
import { FaDownload, FaPrint } from 'react-icons/fa';

const payslips = [
  {
    id: 1,
    month: 'November',
    year: 2025,
    gross: '$5,500',
    deductions: '$200',
    net: '$5,300',
    file: '/payslips/november-2025.pdf',
  },
  {
    id: 2,
    month: 'October',
    year: 2025,
    gross: '$5,450',
    deductions: '$200',
    net: '$5,250',
    file: '/payslips/october-2025.pdf',
  },
  {
    id: 3,
    month: 'September',
    year: 2025,
    gross: '$5,480',
    deductions: '$200',
    net: '$5,280',
    file: '/payslips/september-2025.pdf',
  },
];

const PayslipPage = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Payslips</h1>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payslips.map(payslip => (
              <tr key={payslip.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payslip.month}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{payslip.year}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{payslip.gross}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{payslip.deductions}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{payslip.net}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href={payslip.file} download className="text-indigo-600 hover:text-indigo-900 p-1" title="Download">
                    <FaDownload />
                  </a>
                  <button onClick={() => window.print()} className="text-gray-600 hover:text-gray-900 p-1 ml-2" title="Print">
                    <FaPrint />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayslipPage;
