import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { collection, query, onSnapshot, deleteDoc, doc, where } from 'firebase/firestore';
import { db } from '../../firebase';
import AddEmployeeModal from '../../components/hr/AddEmployeeModal';
import EditEmployeeModal from '../../components/hr/EditEmployeeModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({}); // {employeeId: status}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employeeToEditId, setEmployeeToEditId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterDesignation, setFilterDesignation] = useState('All');

  useEffect(() => {
    const unsubscribeEmployees = onSnapshot(collection(db, 'employees'), (snapshot) => {
      const employeesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmployees(employeesData);
      setLoading(false);
    }, (err) => {
      setError('Failed to fetch employees.');
      console.error(err);
      setLoading(false);
    });

    const unsubscribeDepartments = onSnapshot(collection(db, 'departments'), (snapshot) => {
      const departmentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDepartments(departmentsData);
    }, (err) => {
      console.error('Failed to fetch departments:', err);
    });

    return () => {
      unsubscribeEmployees();
      unsubscribeDepartments();
    };
  }, []);

  useEffect(() => {
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const attendanceQuery = query(
      collection(db, 'attendanceRequests'),
      where('date', '>=', startOfDay),
      where('date', '<=', endOfDay)
    );

    const unsubscribeAttendance = onSnapshot(attendanceQuery, (snapshot) => {
      const records = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        records[data.employeeId] = data.status;
      });
      setAttendanceRecords(records);
    }, (err) => {
      console.error('Error fetching attendance records:', err);
    });

    return () => unsubscribeAttendance();
  }, [selectedDate]);

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteDoc(doc(db, 'employees', employeeId));
      } catch (err) {
        alert('Failed to delete employee.');
        console.error('Error deleting employee:', err);
      }
    }
  };

  const handleEditEmployee = (employeeId) => {
    setEmployeeToEditId(employeeId);
    setIsEditModalOpen(true);
  };

  const getAttendanceStatus = (employeeId) => {
    return attendanceRecords[employeeId] || 'Absent'; // Default to Absent if no record
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'Approved':
      case 'Present':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
      case 'Absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === 'All' || employee.department === filterDepartment;
    const matchesDesignation = filterDesignation === 'All' || employee.designation === filterDesignation;
    return matchesSearch && matchesDepartment && matchesDesignation;
  });

  if (loading) {
    return <div className="p-6 text-center">Loading employees...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Employee Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
        >
          <FaPlus />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-1/3">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy/MM/dd"
              className="w-full rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="relative">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="appearance-none w-full md:w-auto bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
            >
              <option value="All">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <select
              value={filterDesignation}
              onChange={(e) => setFilterDesignation(e.target.value)}
              className="appearance-none w-full md:w-auto bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
            >
              <option value="All">All Designations</option>              
              {/* Designations would ideally be fetched dynamically or managed */}
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Marketing Manager">Marketing Manager</option>
              <option value="Sales Executive">Sales Executive</option>
            </select>
          </div>
          <button className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-200 shadow-sm transition-colors duration-300">
            <FaFilter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Employee Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joining Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee, index) => (
                <tr key={employee.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img className="h-10 w-10 rounded-full object-cover" src={employee.photo || 'https://randomuser.me/api/portraits/men/32.jpg'} alt={employee.name} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.designation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.joiningDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(getAttendanceStatus(employee.id))}`}>
                      {getAttendanceStatus(employee.id)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/hr/employees/${employee.id}`} className="text-indigo-600 hover:text-indigo-900 p-1"><FaEye /></Link>
                    <button onClick={() => handleEditEmployee(employee.id)} className="text-yellow-600 hover:text-yellow-900 p-1 ml-2"><FaEdit /></button>
                    <button onClick={() => handleDeleteEmployee(employee.id)} className="text-red-600 hover:text-red-900 p-1 ml-2"><FaTrash /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-gray-500">No employees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onEmployeeAdded={() => { /* Optionally refresh data or show a success message */ }}
        departments={departments}
      />

      {/* Edit Employee Modal */}
      {employeeToEditId && (
        <EditEmployeeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEmployeeUpdated={() => { /* Optionally refresh data or show a success message */ }}
          employeeId={employeeToEditId}
          departments={departments}
        />
      )}
    </div>
  );
};

export default EmployeesPage;