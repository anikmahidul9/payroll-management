import React, { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

const EditEmployeeModal = ({ isOpen, onClose, onEmployeeUpdated, employeeId, departments }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    department: '',
    designation: '',
    baseSalary: '',
    joiningDate: '',
    contractType: 'Full-time',
    reportingManager: '',
    status: 'Active',
    role: 'employee',
    photo: '',
    personalInfo: {},
    jobInfo: {}
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !employeeId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const employeeDocRef = doc(db, 'employees', employeeId);
    const unsubscribe = onSnapshot(employeeDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          ...data,
          personalInfo: data.personalInfo || {},
          jobInfo: data.jobInfo || {}
        });
        setError('');
      } else {
        setError('Employee data not found.');
      }
      setLoading(false);
    }, (err) => {
      setError('Failed to fetch employee data for editing.');
      console.error(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen, employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('personalInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [field]: value
        }
      }));
    } else if (name.startsWith('jobInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        jobInfo: {
          ...prev.jobInfo,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.department || !formData.baseSalary || !formData.joiningDate) {
      setError('Name, Email, Department, Base Salary, and Joining Date are required.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const employeeDocRef = doc(db, 'employees', employeeId);
      await updateDoc(employeeDocRef, {
        name: formData.name,
        email: formData.email, // Email is read-only in UI, but included for completeness
        phone: formData.phone,
        address: formData.address,
        birthDate: formData.birthDate,
        department: formData.department,
        designation: formData.designation,
        baseSalary: Number(formData.baseSalary),
        joiningDate: formData.joiningDate,
        contractType: formData.contractType,
        reportingManager: formData.reportingManager,
        status: formData.status,
        role: formData.role,
        photo: formData.photo,
        personalInfo: formData.personalInfo,
        jobInfo: formData.jobInfo
      });
      onEmployeeUpdated();
      onClose();
    } catch (err) {
      setError('Failed to update employee. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto text-center">
          Loading employee data...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Personal Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Personal Details</h3>
            </div>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email || ''}
              readOnly // Email is read-only
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
            <input
              name="phone"
              type="text"
              placeholder="Phone Number"
              value={formData.phone || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              name="address"
              type="text"
              placeholder="Address"
              value={formData.address || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex flex-col">
              <label htmlFor="birthDate" className="text-sm font-medium text-gray-700 mb-1">Birth Date</label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <input
              name="photo"
              type="text"
              placeholder="Photo URL (Optional)"
              value={formData.photo || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />

            {/* Job Information */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Job Details</h3>
            </div>
            <select
              name="department"
              value={formData.department || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>Select a Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
            <input
              name="designation"
              type="text"
              placeholder="Designation"
              value={formData.designation || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              name="baseSalary"
              type="number"
              placeholder="Base Salary"
              value={formData.baseSalary || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex flex-col">
              <label htmlFor="joiningDate" className="text-sm font-medium text-gray-700 mb-1">Joining Date</label>
              <input
                id="joiningDate"
                name="joiningDate"
                type="date"
                value={formData.joiningDate || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select
              name="contractType"
              value={formData.contractType || 'Full-time'}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
            <input
              name="reportingManager"
              type="text"
              placeholder="Reporting Manager (UID or Name)"
              value={formData.reportingManager || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <select
              name="status"
              value={formData.status || 'Active'}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
            <select
              name="role"
              value={formData.role || 'employee'}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {submitting ? 'Updating...' : 'Update Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
