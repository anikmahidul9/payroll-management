import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, orderBy, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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

const LeaveRequestsPage = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaveRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'leaveRequests'), orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      let requests = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      // Fetch employee names for each request
      const employeePromises = requests.map(async (request) => {
        const employeeDoc = await getDoc(doc(db, 'employees', request.userId));
        return {
          ...request,
          employeeName: employeeDoc.exists() ? employeeDoc.data().name : 'Unknown Employee',
        };
      });

      requests = await Promise.all(employeePromises);
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

  const updateRequestStatus = async (requestId, status) => {
    try {
      const requestDocRef = doc(db, 'leaveRequests', requestId);
      await updateDoc(requestDocRef, { status });
      fetchLeaveRequests(); // Refresh the list
    } catch (err) {
      setError(`Failed to update request status to ${status}.`);
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Leave Requests</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="7" className="text-center py-4">Loading leave requests...</td></tr>
            ) : leaveRequests.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-4">No leave requests found.</td></tr>
            ) : (
              leaveRequests.map(request => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.employeeName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.leaveType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.endDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{request.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {request.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => updateRequestStatus(request.id, 'Approved')}
                          className="text-green-600 hover:text-green-900 p-1 ml-2"
                          title="Approve"
                        >
                          <FaCheckCircle />
                        </button>
                        <button
                          onClick={() => updateRequestStatus(request.id, 'Rejected')}
                          className="text-red-600 hover:text-red-900 p-1 ml-2"
                          title="Reject"
                        >
                          <FaTimesCircle />
                        </button>
                      </>
                    )}
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

export default LeaveRequestsPage;
