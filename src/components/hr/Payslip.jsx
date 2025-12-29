import React from "react";

const Payslip = ({ employee: payslip, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Payslip</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="border-t border-gray-200 py-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {payslip.employeeName}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">
                <strong>Gross Salary:</strong> ${payslip.grossSalary}
              </p>
              <p className="text-gray-600">
                <strong>Total Deductions:</strong> ${payslip.deductions}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <strong>Net Salary:</strong> ${payslip.netSalary}
              </p>
            </div>
          </div>
          {payslip.deductionDetails && payslip.deductionDetails.length > 0 && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold text-gray-800">Deduction Details</h4>
              <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
                {payslip.deductionDetails.map((ded, index) => (
                  <li key={index} className="px-4 py-2 flex justify-between items-center">
                    <span className="text-sm text-gray-600">{ded.name}</span>
                    <span className="text-sm font-semibold text-red-600">-${ded.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payslip;
