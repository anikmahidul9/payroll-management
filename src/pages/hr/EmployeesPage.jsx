import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const employees = [
  {
    id: 1,
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'John Doe',
    email: 'john.doe@example.com',
    department: 'Engineering',
    designation: 'Frontend Developer',
    joiningDate: '2023-01-15',
    status: 'Active',
  },
  {
    id: 2,
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    department: 'Marketing',
    designation: 'Marketing Manager',
    joiningDate: '2022-11-20',
    status: 'Active',
  },
    {
    id: 3,
    photo: 'https://randomuser.me/api/portraits/men/33.jpg',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    department: 'Sales',
    designation: 'Sales Executive',
    joiningDate: '2023-03-10',
    status: 'Inactive',
  },
  // Add more employee data as needed
];

const EmployeesPage = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Employee Management</h1>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">
          <FaPlus />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-1/2 lg:w-1/3">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <select className="appearance-none w-full md:w-auto bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500">
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Marketing</option>
              <option>Sales</option>
            </select>
          </div>
          <div className="relative">
            <select className="appearance-none w-full md:w-auto bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500">
              <option>All Designations</option>
              <option>Frontend Developer</option>
              <option>Marketing Manager</option>
              <option>Sales Executive</option>
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee, index) => (
              <tr key={employee.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img className="h-10 w-10 rounded-full object-cover" src={employee.photo} alt={employee.name} />
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
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/hr/employees/${employee.id}`} className="text-indigo-600 hover:text-indigo-900 p-1"><FaEye /></Link>
                  <button className="text-yellow-600 hover:text-yellow-900 p-1 ml-2"><FaEdit /></button>
                  <button className="text-red-600 hover:text-red-900 p-1 ml-2"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeesPage;
