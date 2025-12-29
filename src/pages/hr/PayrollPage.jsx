import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase';

const PayrollPage = () => {
  const [employees, setEmployees] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployeeForPayslip, setSelectedEmployeeForPayslip] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [grossSalaryInput, setGrossSalaryInput] = useState('');
  const [deductionsInput, setDeductionsInput] = useState('');
  const [deductionDetails, setDeductionDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeEmployees = onSnapshot(collection(db, 'employees'), (snapshot) => {
      const employeesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmployees(employeesData);
      setLoading(false);
    }, (err) => {
      setError('Failed to fetch employees.');
      console.error(err);
      setLoading(false);
    });

    const fetchDeductions = async () => {
      try {
        const deductionsCollectionRef = collection(db, 'deductions');
        const data = await getDocs(deductionsCollectionRef);
        const deductionsList = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setDeductions(deductionsList);
      } catch (err) {
        console.error('Failed to fetch deductions:', err);
      }
    };

    const unsubscribePayslips = onSnapshot(collection(db, 'payslips'), (snapshot) => {
      const payslipsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        generatedAt: doc.data().generatedAt ? doc.data().generatedAt.toDate() : null,
        paymentDate: doc.data().paymentDate ? doc.data().paymentDate.toDate() : null, // Convert paymentDate
      }));
      setPayslips(payslipsData);
    }, (err) => {
      console.error('Failed to fetch payslips:', err);
    });

    fetchDeductions();
    return () => {
      unsubscribeEmployees();
      unsubscribePayslips();
    };
  }, []);

  const calculateDeductions = (employee) => {
    if (!employee || !deductions.length) {
      setDeductionDetails([]);
      return 0;
    }

    let totalDeductions = 0;
    const details = [];
    deductions.forEach(deduction => {
      let amount = 0;
      if (deduction.type === 'Fixed') {
        amount = deduction.amount;
      } else if (deduction.type === 'Percentage') {
        amount = (employee.baseSalary * deduction.amount) / 100;
      }
      totalDeductions += amount;
      details.push({ name: deduction.name, amount });
    });
    setDeductionDetails(details);
    return totalDeductions;
  };

  const handleEmployeeSelect = (empId) => {
    setSelectedEmployeeForPayslip(empId);
    const selectedEmp = employees.find(emp => emp.id === empId);
    if (selectedEmp) {
      setGrossSalaryInput(selectedEmp.baseSalary || '');
      const calculatedDeductions = calculateDeductions(selectedEmp);
      setDeductionsInput(calculatedDeductions);
    } else {
      setGrossSalaryInput('');
      setDeductionsInput('');
      setDeductionDetails([]);
    }
  };

  const handleGeneratePayslip = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to generate payslips.');
      return;
    }
    if (!selectedEmployeeForPayslip || !month || !year || !grossSalaryInput || !deductionsInput) {
      alert('Please fill all payslip details.');
      return;
    }

    const grossSalary = Number(grossSalaryInput);
    const deductionsValue = Number(deductionsInput);
    const netSalary = grossSalary - deductionsValue;

    try {
      await addDoc(collection(db, 'payslips'), {
        employeeId: selectedEmployeeForPayslip,
        month,
        year: Number(year),
        grossSalary,
        deductions: deductionsValue,
        netSalary,
        deductionDetails,
        generatedBy: user.uid,
        generatedAt: serverTimestamp(),
        paymentStatus: 'Unpaid', // Default status
        paymentDate: null,
      });
      alert('Payslip generated successfully!');
      // Clear form
      setSelectedEmployeeForPayslip('');
      setMonth('');
      setYear('');
      setGrossSalaryInput('');
      setDeductionsInput('');
      setDeductionDetails([]);
    } catch (err) {
      alert('Failed to generate payslip.');
      console.error('Error generating payslip:', err);
    }
  };

  const handleMarkAsPaid = async (payslipId) => {
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to mark payslips as paid.');
      return;
    }
    if (window.confirm('Are you sure you want to mark this payslip as Paid?')) {
      try {
        const payslipRef = doc(db, 'payslips', payslipId);
        await updateDoc(payslipRef, {
          paymentStatus: 'Paid',
          paymentDate: serverTimestamp(),
          paidBy: user.uid, // Record who marked it as paid
        });
        alert('Payslip marked as Paid successfully!');
      } catch (err) {
        alert('Failed to mark payslip as Paid.');
        console.error('Error marking payslip as Paid:', err);
      }
    }
  };

  const handleViewPayslip = (payslipId) => {
    navigate(`/hr/payslip/${payslipId}`);
  };

  if (loading) {
    return <div className="container mx-auto p-6 text-center">Loading payroll data...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Payroll Management</h1>

      {/* Payslip Generation Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Generate New Payslip</h2>
        <form onSubmit={handleGeneratePayslip} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="employeeSelect" className="block text-sm font-medium text-gray-700">Employee</label>
            <select
              id="employeeSelect"
              value={selectedEmployeeForPayslip}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="" disabled>Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700">Month</label>
            <input
              type="text"
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="e.g., January"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g., 2025"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="grossSalary" className="block text-sm font-medium text-gray-700">Gross Salary</label>
            <input
              type="number"
              id="grossSalary"
              value={grossSalaryInput}
              onChange={(e) => setGrossSalaryInput(e.target.value)}
              placeholder="e.g., 5000"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="deductions" className="block text-sm font-medium text-gray-700">Total Deductions</label>
            <input
              type="number"
              id="deductions"
              value={deductionsInput}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
            />
          </div>

          {deductionDetails.length > 0 && (
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-800">Deduction Details</h3>
              <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
                {deductionDetails.map((ded, index) => (
                  <li key={index} className="px-4 py-2 flex justify-between items-center">
                    <span className="text-sm text-gray-600">{ded.name}</span>
                    <span className="text-sm font-semibold text-red-600">-${ded.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              Generate Payslip
            </button>
          </div>
        </form>
      </div>

      {/* Generated Payslips List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 p-6">Generated Payslips</h2>
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Employee Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Month/Year
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
                Generated At
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {payslips.length > 0 ? (
              payslips.map((payslip) => {
                const employee = employees.find(emp => emp.id === payslip.employeeId);
                return (
                  <tr key={payslip.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{employee ? employee.name : 'Unknown'}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{payslip.month}/{payslip.year}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">${payslip.grossSalary}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">${payslip.deductions}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">${payslip.netSalary}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{payslip.generatedAt ? payslip.generatedAt.toLocaleString() : 'N/A'}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payslip.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {payslip.paymentStatus || 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        onClick={() => handleViewPayslip(payslip.id)}
                        className="px-3 py-1 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600"
                      >
                        View
                      </button>
                      {payslip.paymentStatus !== 'Paid' && (
                        <button
                          onClick={() => handleMarkAsPaid(payslip.id)}
                          className="ml-2 px-3 py-1 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600"
                        >
                          Mark as Paid
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center text-gray-500">
                  No payslips generated yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollPage;

