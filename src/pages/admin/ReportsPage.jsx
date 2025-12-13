import React from 'react';

const ReportsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Reports</h1>

      {/* Overview Section */}
      <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Overview & Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-blue-800">Total Employees</h3>
            <p className="text-3xl font-bold text-blue-600">150</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-green-800">Monthly Payroll</h3>
            <p className="text-3xl font-bold text-green-600">$75,000</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-yellow-800">Average Tenure</h3>
            <p className="text-3xl font-bold text-yellow-600">3.5 Years</p>
          </div>
        </div>
      </section>

      {/* Payroll Reports */}
      <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Payroll Reports</h2>
        <ul className="list-disc list-inside text-gray-600">
          <li className="mb-2">
            <a href="#" className="text-indigo-600 hover:underline font-medium">Monthly Payroll Summary</a> - Generate a summary of salaries, deductions, and net pay for the current month.
          </li>
          <li className="mb-2">
            <a href="#" className="text-indigo-600 hover:underline font-medium">Annual Payroll Report</a> - Comprehensive report for tax filings and annual financial review.
          </li>
          <li className="mb-2">
            <a href="#" className="text-indigo-600 hover:underline font-medium">Deductions Breakdown</a> - Detailed report on all employee deductions (taxes, benefits, etc.).
          </li>
        </ul>
        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Generate Payroll Report
        </button>
      </section>

      {/* Employee Reports */}
      <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Employee Reports</h2>
        <ul className="list-disc list-inside text-gray-600">
          <li className="mb-2">
            <a href="#" className="text-indigo-600 hover:underline font-medium">Employee Directory</a> - List of all active employees with contact information.
          </li>
          <li className="mb-2">
            <a href="#" className="text-indigo-600 hover:underline font-medium">New Hires Report</a> - Report on employees hired within a specified period.
          </li>
          <li className="mb-2">
            <a href="#" className="text-indigo-600 hover:underline font-medium">Turnover Rate Analysis</a> - Analyze employee attrition over time.
          </li>
        </ul>
        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Generate Employee Report
        </button>
      </section>

      {/* Attendance Reports */}
      <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Attendance Reports</h2>
        <ul className="list-disc list-inside text-gray-600">
          <li className="mb-2">
            <a href="#" className="text-indigo-600 hover:underline font-medium">Monthly Attendance Log</a> - Detailed log of employee attendance for a given month.
          </li>
          <li className="mb-2">
            <a href="#" className="text-indigo-600 hover:underline font-medium">Leave Request Summary</a> - Overview of approved and pending leave requests.
          </li>
          <li className="mb-2">
            <a href="#" className="text-indigo-600 hover:underline font-medium">Overtime Hours Report</a> - Report detailing employee overtime hours.
          </li>
        </ul>
        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Generate Attendance Report
        </button>
      </section>
    </div>
  );
};

export default ReportsPage;
