import React, { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';

const DeductionsPage = () => {
  const [deductions, setDeductions] = useState([]);
  const [newDeductionName, setNewDeductionName] = useState('');
  const [newDeductionType, setNewDeductionType] = useState('Fixed');
  const [newDeductionAmount, setNewDeductionAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDeductions = useCallback(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, 'deductions'), (snapshot) => {
      const deductionsList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setDeductions(deductionsList);
      setError(null);
      setLoading(false);
    }, (err) => {
      setError('Failed to fetch deductions.');
      console.error(err);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = fetchDeductions();
    return () => unsubscribe();
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
      setError(null);
      setIsModalOpen(false); // Close modal on success
    } catch (err) {
      setError('Failed to add deduction.');
      console.error(err);
    }
  };

  const handleDelete = async (deductionId) => {
    if (window.confirm('Are you sure you want to delete this deduction?')) {
      try {
        await deleteDoc(doc(db, 'deductions', deductionId));
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

  const openModal = () => {
    setIsModalOpen(true);
    setError(null); // Clear previous errors when opening modal
  };
  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return <div className="p-6 text-center">Loading deductions...</div>;
  }

  if (error && !isModalOpen) { // Only show global error if modal is not open
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Deductions Management</h1>
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
        >
          <FaPlus />
          <span>Add Deduction</span>
        </button>
      </div>

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
            {deductions.length > 0 ? (
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
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No deductions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Deduction</h2>
            <form onSubmit={handleAddDeduction}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Deduction Name</label>
                <input
                  type="text"
                  id="name"
                  value={newDeductionName}
                  onChange={(e) => setNewDeductionName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Deduction Type</label>
                <select
                  id="type"
                  value={newDeductionType}
                  onChange={(e) => setNewDeductionType(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option>Fixed</option>
                  <option>Percentage</option>
                </select>
              </div>
              <div className="mb-6">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount / Percentage</label>
                <input
                  type="number"
                  id="amount"
                  value={newDeductionAmount}
                  onChange={(e) => setNewDeductionAmount(e.target.value)}
                  placeholder="e.g., 150 or 5"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex justify-end gap-4">
                <button type="button" onClick={closeModal} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeductionsPage;