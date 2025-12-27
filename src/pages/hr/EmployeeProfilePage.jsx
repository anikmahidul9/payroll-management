import React, { useState } from 'react';
import { FaEdit, FaFileAlt, FaMoneyBillWave, FaUser, FaBriefcase, FaIdCard, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake } from 'react-icons/fa';

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
    probationPeriod: '3 Months',
    reportingManager: 'Alice Smith',
  },
  salaryDetails: {
    basicSalary: '$5,000',
    allowances: '$500',
    deductions: '$200',
    netSalary: '$5,300',
  },
  documents: [
    { id: 1, name: 'Offer Letter.pdf', type: 'Offer Documents' },
    { id: 2, name: 'Contract.pdf', type: 'Employment Contracts' },
    { id: 3, name: 'ID_Proof.pdf', type: 'Identity Verification' },
  ],
};

const EmployeeProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal');

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><p className="font-semibold text-gray-700">Email:</p><p className="text-gray-600">{employeeData.personalInfo.email}</p></div>
            <div><p className="font-semibold text-gray-700">Phone:</p><p className="text-gray-600">{employeeData.personalInfo.phone}</p></div>
            <div><p className="font-semibold text-gray-700">Address:</p><p className="text-gray-600">{employeeData.personalInfo.address}</p></div>
            <div><p className="font-semibold text-gray-700">Birth Date:</p><p className="text-gray-600">{employeeData.personalInfo.birthDate}</p></div>
          </div>
        );
      case 'job':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><p className="font-semibold text-gray-700">Joining Date:</p><p className="text-gray-600">{employeeData.jobInfo.joiningDate}</p></div>
            <div><p className="font-semibold text-gray-700">Contract Type:</p><p className="text-gray-600">{employeeData.jobInfo.contractType}</p></div>
            <div><p className="font-semibold text-gray-700">Probation Period:</p><p className="text-gray-600">{employeeData.jobInfo.probationPeriod}</p></div>
            <div><p className="font-semibold text-gray-700">Reporting Manager:</p><p className="text-gray-600">{employeeData.jobInfo.reportingManager}</p></div>
          </div>
        );
      case 'salary':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><p className="font-semibold text-gray-700">Basic Salary:</p><p className="text-gray-600">{employeeData.salaryDetails.basicSalary}</p></div>
            <div><p className="font-semibold text-gray-700">Allowances:</p><p className="text-gray-600">{employeeData.salaryDetails.allowances}</p></div>
            <div><p className="font-semibold text-gray-700">Deductions:</p><p className="text-gray-600">{employeeData.salaryDetails.deductions}</p></div>
            <div><p className="font-semibold text-gray-700">Net Salary:</p><p className="text-gray-600">{employeeData.salaryDetails.netSalary}</p></div>
          </div>
        );
      case 'documents':
        return (
          <ul>
            {employeeData.documents.map(doc => (
              <li key={doc.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <FaFileAlt className="text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-800">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.type}</p>
                  </div>
                </div>
                <button className="text-indigo-600 hover:underline">Download</button>
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <img src={employeeData.photo} alt={employeeData.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-indigo-200" />
            <h2 className="text-2xl font-bold text-gray-800">{employeeData.name}</h2>
            <p className="text-gray-600">{employeeData.designation}</p>
            <p className="text-sm text-gray-500 mb-4">{employeeData.department}</p>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${employeeData.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {employeeData.status}
            </span>
            <p className="text-sm text-gray-500 mt-4">Employee ID: {employeeData.id}</p>
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Quick Actions</h3>
              <div className="flex flex-col space-y-3">
                <button className="flex items-center justify-center gap-2 w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                  <FaEdit /><span>Edit Profile</span>
                </button>
                <button className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                  <FaFileAlt /><span>Documents</span>
                </button>
                <button className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                  <FaMoneyBillWave /><span>Salary Structure</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button onClick={() => setActiveTab('personal')} className={`py-4 px-6 font-semibold border-b-2 ${activeTab === 'personal' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Personal Info</button>
                <button onClick={() => setActiveTab('job')} className={`py-4 px-6 font-semibold border-b-2 ${activeTab === 'job' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Job Info</button>
                <button onClick={() => setActiveTab('salary')} className={`py-4 px-6 font-semibold border-b-2 ${activeTab === 'salary' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Salary Details</button>
                <button onClick={() => setActiveTab('documents')} className={`py-4 px-6 font-semibold border-b-2 ${activeTab === 'documents' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Documents</button>
              </nav>
            </div>
            <div className="p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfilePage;
