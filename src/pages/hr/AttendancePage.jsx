import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { collection, query, onSnapshot, doc, updateDoc, serverTimestamp, where } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

const getStatusColor = (status) => {
  switch (status) {
    case "Approved":
      return "bg-green-200 text-green-900";
    case "Rejected":
      return "bg-red-200 text-red-900";
    case "Pending":
      return "bg-yellow-200 text-yellow-900";
    default:
      return "bg-gray-200 text-gray-900";
  }
};

const AttendancePage = () => {
  const [attendanceRequests, setAttendanceRequests] = useState([]);
  const [employees, setEmployees] = useState([]); // To map employee IDs to names
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState("All"); // All, Pending, Approved, Rejected

  useEffect(() => {
    const unsubscribeEmployees = onSnapshot(collection(db, 'employees'), (snapshot) => {
      const employeesData = {};
      snapshot.docs.forEach(doc => {
        employeesData[doc.id] = doc.data().name;
      });
      setEmployees(employeesData);
    }, (err) => {
      console.error('Error fetching employees for attendance:', err);
    });

    const attendanceQuery = query(collection(db, 'attendanceRequests'));
    const unsubscribeAttendance = onSnapshot(attendanceQuery, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(), // Convert Firestore Timestamp to Date object
        requestedAt: doc.data().requestedAt ? doc.data().requestedAt.toDate() : null,
        approvedAt: doc.data().approvedAt ? doc.data().approvedAt.toDate() : null,
      }));
      setAttendanceRequests(requestsData);
      setLoading(false);
    }, (err) => {
      setError('Failed to fetch attendance requests.');
      console.error(err);
      setLoading(false);
    });

    return () => {
      unsubscribeEmployees();
      unsubscribeAttendance();
    };
  }, []);

  const handleApproveReject = async (requestId, status) => {
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to approve/reject requests.');
      return;
    }
    try {
      const requestRef = doc(db, 'attendanceRequests', requestId);
      await updateDoc(requestRef, {
        status: status,
        approvedBy: user.uid,
        approvedAt: serverTimestamp(),
      });
    } catch (err) {
      alert(`Failed to ${status.toLowerCase()} request.`);
      console.error(`Error ${status.toLowerCase()} request:`, err);
    }
  };

  const filteredRequests = attendanceRequests.filter((request) => {
    const employeeName = employees[request.employeeId]?.toLowerCase() || '';
    const matchesSearch = employeeName.includes(searchQuery.toLowerCase());

    const requestDate = request.date;
    const selectedDay = selectedDate.getDate();
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    const matchesDate = requestDate.getDate() === selectedDay &&
                        requestDate.getMonth() === selectedMonth &&
                        requestDate.getFullYear() === selectedYear;

    const matchesStatus = filterStatus === "All" || request.status === filterStatus;

    return matchesSearch && matchesDate && matchesStatus;
  });

  if (loading) {
    return <div className="container mx-auto p-6 text-center">Loading attendance requests...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Attendance Management</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by employee name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </header>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Employee Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Requested At
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{employees[request.employeeId] || 'N/A'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{request.date.toLocaleDateString()}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{request.requestedAt ? request.requestedAt.toLocaleString() : 'N/A'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span
                      className={`relative inline-block px-3 py-1 font-semibold leading-tight ${getStatusColor(
                        request.status
                      )}`}
                    >
                      <span
                        aria-hidden
                        className="absolute inset-0 opacity-50 rounded-full"
                      ></span>
                      <span className="relative">{request.status}</span>
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {request.status === 'Pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveReject(request.id, 'Approved')}
                          className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproveReject(request.id, 'Rejected')}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {(request.status === 'Approved' || request.status === 'Rejected') && (
                      <p className="text-gray-600 text-xs">
                        By: {employees[request.approvedBy] || 'N/A'} at {request.approvedAt ? request.approvedAt.toLocaleString() : 'N/A'}
                      </p>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center text-gray-500">
                  No attendance requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePage;
