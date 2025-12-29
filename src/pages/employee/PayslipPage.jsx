import React, { useState, useEffect } from 'react';
import { FaEye, FaPrint } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

const PayslipPage = () => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Fetch payslips for the logged-in employee
        const payslipsQuery = query(
          collection(db, 'payslips'),
          where('employeeId', '==', user.uid),
          orderBy('year', 'desc'),
          orderBy('month', 'desc') // Assuming month can be sorted alphabetically or numerically
        );

        const unsubscribePayslips = onSnapshot(payslipsQuery, (snapshot) => {
          const payslipsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore Timestamp to Date object if needed for display
            generatedAt: doc.data().generatedAt ? doc.data().generatedAt.toDate() : null,
            paymentDate: doc.data().paymentDate ? doc.data().paymentDate.toDate() : null,
          }));
          setPayslips(payslipsData);
          setLoading(false);
        }, (err) => {
          setError('Failed to fetch payslips.');
          console.error(err);
          setLoading(false);
        });

        return () => {
          unsubscribePayslips();
        };
      } else {
        setError('No user is currently logged in.');
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleViewPayslip = (payslipId) => {
    navigate(`/employee/payslip/${payslipId}`);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading payslips...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payslips.length > 0 ? (
              payslips.map(payslip => (
                <tr key={payslip.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payslip.month}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{payslip.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${payslip.grossSalary}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${payslip.deductions}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${payslip.netSalary}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payslip.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                      payslip.paymentStatus === 'Unpaid' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {payslip.paymentStatus || 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleViewPayslip(payslip.id)} className="text-indigo-600 hover:text-indigo-900 p-1" title="View">
                      <FaEye />
                    </button>
                    <button onClick={() => window.print()} className="text-gray-600 hover:text-gray-900 p-1 ml-2" title="Print">
                      <FaPrint />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No payslips found.</td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayslipPage;
