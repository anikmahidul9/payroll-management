import React from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake, FaBriefcase, FaIdCard } from 'react-icons/fa';

const employeeData = {
  id: 'EMP001',
  name: 'John Doe',
  designation: 'Frontend Developer',
  department: 'Engineering',
  status: 'Active',
  photo: 'https://randomuser.me/api/portraits/men/32.jpg',
  personalInfo: {
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main St, Anytown, USA',
    birthDate: '1990-05-20',
  },
  jobInfo: {
    joiningDate: '2023-01-15',
    contractType: 'Full-time',
    reportingManager: 'Alice Smith',
  },
};

const ProfilePage = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="flex flex-col items-center md:flex-row md:items-start gap-8 mb-8">
          <img src={employeeData.photo} alt={employeeData.name} className="w-32 h-32 rounded-full border-4 border-indigo-200" />
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-800">{employeeData.name}</h1>
            <p className="text-xl text-gray-600">{employeeData.designation}</p>
            <p className="text-md text-gray-500">{employeeData.department}</p>
            <span className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${employeeData.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {employeeData.status}
            </span>
          </div>
        </div>

        {/* Personal Information */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-gray-500" />
              <div>
                <p className="font-semibold text-gray-700">Email</p>
                <p className="text-gray-600">{employeeData.personalInfo.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaPhone className="text-gray-500" />
              <div>
                <p className="font-semibold text-gray-700">Phone</p>
                <p className="text-gray-600">{employeeData.personalInfo.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-gray-500" />
              <div>
                <p className="font-semibold text-gray-700">Address</p>
                <p className="text-gray-600">{employeeData.personalInfo.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaBirthdayCake className="text-gray-500" />
              <div>
                <p className="font-semibold text-gray-700">Birth Date</p>
                <p className="text-gray-600">{employeeData.personalInfo.birthDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Information */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">Job Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <FaIdCard className="text-gray-500" />
              <div>
                <p className="font-semibold text-gray-700">Employee ID</p>
                <p className="text-gray-600">{employeeData.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaBriefcase className="text-gray-500" />
              <div>
                <p className="font-semibold text-gray-700">Joining Date</p>
                <p className="text-gray-600">{employeeData.jobInfo.joiningDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaUser className="text-gray-500" />
              <div>
                <p className="font-semibold text-gray-700">Reporting Manager</p>
                <p className="text-gray-600">{employeeData.jobInfo.reportingManager}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaBriefcase className="text-gray-500" />
              <div>
                <p className="font-semibold text-gray-700">Contract Type</p>
                <p className="text-gray-600">{employeeData.jobInfo.contractType}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
