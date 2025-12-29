import React, { useState, useEffect, useCallback } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { collection, query, where, orderBy, addDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase';

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const LeavePage = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchLeaveRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    const user = auth.currentUser;
    if (!user) {
      setError('No user logged in.');
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'leaveRequests'),
        where('userId', '==', user.uid),
        orderBy('startDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const requests = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setLeaveRequests(requests);
    } catch (err) {
      setError('Failed to fetch leave requests.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !leaveType || !reason) {
      setError('All fields are required.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date.');
      return;
    }

    setSubmitting(true);
    setError(null);
    const user = auth.currentUser;

    if (!user) {
      setError('You must be logged in to submit a request.');
      setSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, 'leaveRequests'), {
        userId: user.uid,
        startDate,
        endDate,
        leaveType,
        reason,
        status: 'Pending',
        submittedAt: new Date().toISOString(),
      });
      setStartDate('');
      setEndDate('');
      setLeaveType('');
      setReason('');
      fetchLeaveRequests(); // Refresh the list
    } catch (err) {
      setError('Failed to submit leave request.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Leave Management</h1>

      {/* Apply for Leave Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Apply for Leave</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label htmlFor="leave-type" className="block text-sm font-medium text-gray-700">Leave Type</label>
              <select
                id="leave-type"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Leave Type</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
              </select>
            </div>
            <div>
              <label htmlFor="from-date" className="block text-sm font-medium text-gray-700">From Date</label>
              <input
                type="date"
                id="from-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="to-date" className="block text-sm font-medium text-gray-700">To Date</label>
              <input
                type="date"
                id="to-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
              <textarea
                id="reason"
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              ></textarea>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 disabled:opacity-50"
          >
            <FaPaperPlane />
            <span>{submitting ? 'Submitting...' : 'Submit Request'}</span>
          </button>
        </form>
      </div>

      {/* Leave History */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-800 p-6">Leave History</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-4">Loading history...</td></tr>
            ) : error ? (
              <tr><td colSpan="4" className="text-center py-4 text-red-500">{error}</td></tr>
            ) : leaveRequests.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-4">No leave requests found.</td></tr>
            ) : (
              leaveRequests.map(leave => (
                <tr key={leave.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{leave.leaveType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{leave.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{leave.endDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                      {leave.status}
                    </span>
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

export default LeavePage;
