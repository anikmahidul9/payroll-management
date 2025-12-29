import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';

const DeductionsPage = () => {
  const [deductions, setDeductions] = useState([]);
  const [newDeductionName, setNewDeductionName] = useState('');
  const [newDeductionType, setNewDeductionType] = useState('Fixed');
  const [newDeductionAmount, setNewDeductionAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDeductions = useCallback(async () => {
    setLoading(true);
    try {
      const deductionsCollectionRef = collection(db, 'deductions');
      const data = await getDocs(deductionsCollectionRef);
      const deductionsList = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setDeductions(deductionsList);
      setError(null);
    } catch (err) {
      setError('Failed to fetch deductions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeductions();
  }, [fetchDeductions]);

  const handleAddDeduction = async (e) => {
    e.preventDefault();
    if (!newDeductionName.trim() || !newDeductionAmount) {
      setError('All fields are required.');
      return;
    }
    try {
      await addDoc(collection(db, 'deductions'), {
        name: newDeductionName,
        type: newDeductionType,
        amount: Number(newDeductionAmount), // Ensure amount is stored as a number
      });
      setNewDeductionName('');
      setNewDeductionType('Fixed');
      setNewDeductionAmount('');
      fetchDeductions();
    } catch (err) {
      setError('Failed to add deduction.');
      console.error(err);
    }
  };

  const handleDelete = async (deductionId) => {
    if (window.confirm('Are you sure you want to delete this deduction?')) {
      try {
        await deleteDoc(doc(db, 'deductions', deductionId));
        fetchDeductions();
      } catch (err) {
        setError('Failed to delete deduction.');
        console.error(err);
      }
    }
  };

  const formatAmount = (deduction) => {
    if (deduction.type === 'Percentage') {
      return `${deduction.amount}%`;
    }
    return `${Number(deduction.amount).toFixed(2)}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Deductions</h1>

      {/* Add Deduction Form */}
      <form onSubmit={handleAddDeduction} className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Deduction Name</label>
            <input
              id="name"
              type="text"
              value={newDeductionName}
              onChange={(e) => setNewDeductionName(e.target.value)}
              placeholder="e.g., Health Insurance"
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
            <select
              id="type"
              value={newDeductionType}
              onChange={(e) => setNewDeductionType(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option>Fixed</option>
              <option>Percentage</option>
            </select>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount / %</label>
            <input
              id="amount"
              type="number"
              value={newDeductionAmount}
              onChange={(e) => setNewDeductionAmount(e.target.value)}
              placeholder="e.g., 150 or 5"
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
          >
            <FaPlus />
            <span>Add Deduction</span>
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>

      {/* Deductions Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deduction Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
            ) : (
              deductions.map(deduction => (
                <tr key={deduction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{deduction.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatAmount(deduction)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${deduction.type === 'Percentage' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                      {deduction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-yellow-600 hover:text-yellow-900 p-1" disabled><FaEdit /></button>
                    <button onClick={() => handleDelete(deduction.id)} className="text-red-600 hover:text-red-900 p-1 ml-2"><FaTrash /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeductionsPage;
