import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaPlane, FaClock, FaCalendarDay } from 'react-icons/fa';
import { auth, db } from '../../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

const getStatusIcon = (status) => {
  switch (status) {
    case 'Approved':
      return <FaCheckCircle className="text-green-500" />;
    case 'Rejected':
      return <FaTimesCircle className="text-red-500" />;
    case 'Pending':
      return <FaClock className="text-yellow-500" />;
    default:
      return null;
  }
};

const AttendancePage = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMarkingPresent, setIsMarkingPresent] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState(null); // To check if already marked present today

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setError('No user is currently logged in.');
      setLoading(false);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const attendanceQuery = query(
      collection(db, 'attendanceRequests'),
      where('employeeId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(attendanceQuery, (snapshot) => {
      const records = snapshot.docs.map(doc => {
        const data = doc.data();
        const recordDate = data.date.toDate(); // Convert Firestore Timestamp to Date object
        recordDate.setHours(0, 0, 0, 0);

        // Check if this record is for today
        if (recordDate.getTime() === today.getTime()) {
          setTodayAttendance({ id: doc.id, ...data });
        }
        return { id: doc.id, ...data, date: recordDate.toLocaleDateString() };
      });
      setAttendanceRecords(records);
      setLoading(false);
    }, (err) => {
      setError('Failed to fetch attendance records.');
      console.error(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleMarkPresent = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError('You must be logged in to mark present.');
      return;
    }

    if (todayAttendance) {
      alert('You have already marked present for today or have a pending request.');
      return;
    }

    setIsMarkingPresent(true);
    try {
      const employeeDocRef = doc(db, 'employees', user.uid);
      const employeeSnap = await getDoc(employeeDocRef);
      let employeeName = 'Unknown Employee';
      if (employeeSnap.exists()) {
        employeeName = employeeSnap.data().name || 'Unknown Employee';
      }

      await addDoc(collection(db, 'attendanceRequests'), {
        employeeId: user.uid,
        employeeName: employeeName,
        date: serverTimestamp(), // Use server timestamp for consistency
        status: 'Pending',
        requestType: 'present',
        requestedAt: serverTimestamp(),
      });
      alert('Present request submitted successfully!');
    } catch (err) {
      setError('Failed to submit present request.');
      console.error(err);
    } finally {
      setIsMarkingPresent(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading attendance...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Attendance</h1>

      <div className="mb-6 flex justify-end">
        <button
          onClick={handleMarkPresent}
          disabled={isMarkingPresent || todayAttendance}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 disabled:bg-gray-400"
        >
          <FaCalendarDay />
          <span>{todayAttendance ? 'Marked Present Today' : (isMarkingPresent ? 'Submitting...' : 'Mark Present Today')}</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendanceRecords.length > 0 ? (
              attendanceRecords.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 flex items-center gap-2">
                    {getStatusIcon(record.status)}
                    <span>{record.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {record.requestedAt ? new Date(record.requestedAt.toDate()).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No attendance records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePage;
