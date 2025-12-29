import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { FaTrash, FaPlus } from 'react-icons/fa';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const departmentsCollectionRef = collection(db, 'departments');
      const data = await getDocs(departmentsCollectionRef);
      const departmentsList = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setDepartments(departmentsList);
      setError(null);
    } catch (err) {
      setError('Failed to fetch departments.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDepartmentName.trim()) {
      setError('Department name cannot be empty.');
      return;
    }
    try {
      await addDoc(collection(db, 'departments'), { name: newDepartmentName });
      setNewDepartmentName('');
      fetchDepartments(); // Refresh the list
    } catch (err) {
      setError('Failed to add department.');
      console.error(err);
    }
  };

  const handleDelete = async (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        const departmentDocRef = doc(db, 'departments', departmentId);
        await deleteDoc(departmentDocRef);
        fetchDepartments(); // Refresh the list
      } catch (err) {
        setError('Failed to delete department.');
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Departments</h1>

      {/* Add Department Form */}
      <form onSubmit={handleAddDepartment} className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={newDepartmentName}
            onChange={(e) => setNewDepartmentName(e.target.value)}
            placeholder="New Department Name"
            className="flex-grow w-full rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm text-gray-800 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
          >
            <FaPlus />
            <span>Add</span>
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Departments List */}
      <div className="bg-white rounded-lg shadow-lg">
        <ul className="divide-y divide-gray-200">
          {loading ? (
            <li className="p-4 text-center">Loading...</li>
          ) : (
            departments.map(dept => (
              <li key={dept.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                <span className="text-gray-800 font-medium">{dept.name}</span>
                <button
                  onClick={() => handleDelete(dept.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100"
                  aria-label={`Delete ${dept.name}`}
                >
                  <FaTrash />
                </button>
              </li>
            ))
          )}
          {!loading && departments.length === 0 && (
            <li className="p-4 text-center text-gray-500">No departments found. Add one above.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DepartmentsPage;
