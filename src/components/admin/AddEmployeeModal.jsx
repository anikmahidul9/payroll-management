import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const AddEmployeeModal = ({ isOpen, onClose, onEmployeeAdded, departments }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // New state for password
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [baseSalary, setBaseSalary] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [contractType, setContractType] = useState('Full-time');
  const [reportingManager, setReportingManager] = useState('');
  const [status, setStatus] = useState('Active');
  const [role, setRole] = useState('employee'); // Default role for new employees
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Set default department when departments list is loaded
  useEffect(() => {
    if (isOpen) {
        // Reset form on open
        setName('');
        setEmail('');
        setPassword(''); // Reset password field
        setPhone('');
        setAddress('');
        setBirthDate('');
        setDepartment(departments && departments.length > 0 ? departments[0].name : '');
        setDesignation('');
        setBaseSalary('');
        setJoiningDate('');
        setContractType('Full-time');
        setReportingManager('');
        setStatus('Active');
        setRole('employee');
        setError('');
    }
  }, [isOpen, departments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !department || !baseSalary || !joiningDate) {
      setError('Name, Email, Password, Department, Base Salary, and Joining Date are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 2. Store employee details in Firestore using the Auth UID as document ID
      await setDoc(doc(db, 'employees', uid), {
        id: uid, // Store UID as employee ID
        name,
        email,
        phone,
        address,
        birthDate,
        department,
        designation,
        baseSalary: Number(baseSalary),
        joiningDate,
        contractType,
        reportingManager,
        status,
        role,
        photo: '', // Placeholder for photo URL
        personalInfo: {
          email,
          phone,
          address,
          birthDate,
        },
        jobInfo: {
          joiningDate,
          contractType,
          reportingManager,
        }
      });
      onEmployeeAdded(); // Notify parent to refresh
      onClose(); // Close modal on success
    } catch (err) {
      console.error("Error adding employee:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('The email address is already in use by another account.');
      } else {
        setError(`Failed to add employee: ${err.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Personal Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Personal Details</h3>
            </div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex flex-col">
              <label htmlFor="birthDate" className="text-sm font-medium text-gray-700 mb-1">Birth Date</label>
              <input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Job Information */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Job Details</h3>
            </div>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>Select a Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="number"
              placeholder="Base Salary"
              value={baseSalary}
              onChange={(e) => setBaseSalary(e.target.value)}
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex flex-col">
              <label htmlFor="joiningDate" className="text-sm font-medium text-gray-700 mb-1">Joining Date</label>
              <input
                id="joiningDate"
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
            <input
              type="text"
              placeholder="Reporting Manager (UID or Name)"
              value={reportingManager}
              onChange={(e) => setReportingManager(e.target.value)}
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
              {submitting ? 'Adding...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
