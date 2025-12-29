import React, { useState, useEffect } from 'react';
import { FaUser, FaFileInvoice, FaCalendarAlt, FaPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase'; // Import Firebase auth and db
import { doc, collection, query, where, onSnapshot } from 'firebase/firestore'; // Import Firestore functions for real-time updates

const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [recentPayslips, setRecentPayslips] = useState([]);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = []; // Array to store unsubscribe functions

    const setupRealtimeListeners = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Real-time listener for employee data
          const employeeDocRef = doc(db, 'employees', user.uid);
          const unsubscribeEmployee = onSnapshot(employeeDocRef, (docSnap) => {
            if (docSnap.exists()) {
              setEmployeeData(docSnap.data());
              setError(null); // Clear any previous error
            } else {
              setEmployeeData(null);
              setError('No employee data found for this user.');
              console.log(`Debug: No employee document found for UID: ${user.uid}`); // Added for debugging
            }
            setLoading(false); // Set loading to false after initial fetch
          }, (err) => {
            setError('Failed to fetch employee data in real-time.');
            console.error(err);
            setLoading(false);
          });
          unsubscribe.push(unsubscribeEmployee);

          // Real-time listener for recent payslips
          const payslipsCollectionRef = collection(db, 'payslips');
          const payslipsQuery = query(
            payslipsCollectionRef,
            where('employeeId', '==', user.uid)
          );
          const unsubscribePayslips = onSnapshot(payslipsQuery, (snapshot) => {
            const payslipsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort payslips by year and month
            payslipsList.sort((a, b) => {
              if (a.year !== b.year) {
                return b.year - a.year;
              }
              // Assuming month is a string name like "January", "February", etc.
              const monthA = new Date(Date.parse(a.month +" 1, 2012")).getMonth();
              const monthB = new Date(Date.parse(b.month +" 1, 2012")).getMonth();
              return monthB - monthA;
            });
            setRecentPayslips(payslipsList.slice(0, 5)); // Get the 5 most recent payslips
            setError(null); // Clear any previous error
            setLoading(false); // Set loading to false after initial fetch
          }, (err) => {
            setError('Failed to fetch recent payslips in real-time.');
            console.error(err);
            setLoading(false);
          });
          unsubscribe.push(unsubscribePayslips);

          // Real-time listener for upcoming holidays
          const holidaysCollectionRef = collection(db, 'holidays');
          const holidaysQuery = query(
            holidaysCollectionRef,
            where('date', '>=', new Date()) // Only fetch holidays from today onwards
          );
          const unsubscribeHolidays = onSnapshot(holidaysQuery, (snapshot) => {
            const holidaysList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUpcomingHolidays(holidaysList);
            setError(null); // Clear any previous error
            setLoading(false); // Set loading to false after initial fetch
          }, (err) => {
            setError('Failed to fetch upcoming holidays in real-time.');
            console.error(err);
            setLoading(false);
          });
          unsubscribe.push(unsubscribeHolidays);

        } else {
          setError('No user is currently logged in.');
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to set up real-time listeners.');
        console.error(err);
        setLoading(false);
      }
    };

    setupRealtimeListeners();

    // Cleanup function to unsubscribe from all listeners
    return () => {
      unsubscribe.forEach(unsub => unsub());
    };
  }, []);

  // Hard-coded data for UI elements that are not yet dynamic
  const quickAccessLinks = [
    { id: 1, title: 'My Profile', icon: <FaUser className="text-3xl text-blue-500" />, link: '/employee/profile' },
    { id: 2, title: 'My Payslips', icon: <FaFileInvoice className="text-3xl text-green-500" />, link: '/employee/payslip' },
    { id: 3, title: 'My Attendance', icon: <FaCalendarAlt className="text-3xl text-yellow-500" />, link: '/employee/attendance' },
    { id: 4, title: 'Apply for Leave', icon: <FaPlane className="text-3xl text-red-500" />, link: '/employee/leave' },
  ];

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Welcome Header */}
      {employeeData && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 flex items-center gap-6">
          <img 
            src={employeeData.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'} 
            alt={employeeData.name} 
            className="w-24 h-24 rounded-full border-4 border-indigo-200" 
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {employeeData.name}!</h1>
            <p className="text-gray-600">{employeeData.designation}, {employeeData.department}</p>
          </div>
        </div>
      )}

      {/* Quick Access Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickAccessLinks.map(item => (
          <Link key={item.id} to={item.link}>
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center transition-transform transform hover:scale-105">
              <div className="mb-4">{item.icon}</div>
              <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payslips */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Payslips</h2>
          <ul className="divide-y divide-gray-200">
            {recentPayslips.length > 0 ? (
              recentPayslips.map(payslip => (
                <li key={payslip.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{payslip.month} {payslip.year}</p>
                    <p className="text-sm text-gray-500">Net Salary: ${payslip.netSalary}</p>
                  </div>
                  <Link to={`/employee/payslip/${payslip.id}`} className="text-indigo-600 hover:underline">View Details</Link>
                </li>
              ))
            ) : (
              <li className="py-3 text-gray-500">No recent payslips available.</li>
            )}
          </ul>
        </div>

        {/* Upcoming Holidays */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Holidays</h2>
          <ul className="divide-y divide-gray-200">
            {upcomingHolidays.length > 0 ? (
              upcomingHolidays.map(holiday => (
                <li key={holiday.id} className="py-3">
                  <p className="font-semibold text-gray-800">{holiday.name}</p>
                  <p className="text-sm text-gray-500">
                    {holiday.date && holiday.date.toDate ? holiday.date.toDate().toLocaleDateString() : holiday.date}
                  </p>
                </li>
              ))
            ) : (
              <li className="py-3 text-gray-500">No upcoming holidays.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
