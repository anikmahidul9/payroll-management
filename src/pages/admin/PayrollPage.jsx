import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const PayrollPage = () => {
  const [employees, setEmployees] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const employeesCollectionRef = collection(db, 'employees');
      const deductionsCollectionRef = collection(db, 'deductions');

      const [employeesSnapshot, deductionsSnapshot] = await Promise.all([
        getDocs(employeesCollectionRef),
        getDocs(deductionsCollectionRef),
      ]);

      const employeesList = employeesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const deductionsList = deductionsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      setEmployees(employeesList);
      setDeductions(deductionsList);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const calculatePayroll = (employee) => {
    const grossSalary = employee.baseSalary || 0;
    let totalDeductions = 0;

    deductions.forEach(deduction => {
      if (deduction.type === 'Fixed') {
        totalDeductions += Number(deduction.amount);
      } else if (deduction.type === 'Percentage') {
        totalDeductions += grossSalary * (Number(deduction.amount) / 100);
      }
    });

    const netSalary = grossSalary - totalDeductions;
    return { grossSalary, totalDeductions, netSalary };
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Payroll Management</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Employee Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Gross Salary
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Deductions
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Net Salary
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-4">Loading data...</td></tr>
            ) : error ? (
              <tr><td colSpan="5" className="text-center py-4 text-red-500">{error}</td></tr>
            ) : (
              employees.map((employee) => {
                const { grossSalary, totalDeductions, netSalary } = calculatePayroll(employee);
                return (
                  <tr key={employee.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{employee.name}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">${grossSalary.toFixed(2)}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-red-600 whitespace-no-wrap">-${totalDeductions.toFixed(2)}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-green-600 font-semibold whitespace-no-wrap">${netSalary.toFixed(2)}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <Link
                        to={`/admin/payslip/${employee.id}`}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Generate Payslip
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollPage;
