import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake, FaBriefcase, FaIdCard, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { auth, db } from '../../firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

const ProfilePage = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({});

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setError('No user is currently logged in.');
      setLoading(false);
      return;
    }

    const employeeDocRef = doc(db, 'employees', user.uid);
    const unsubscribe = onSnapshot(employeeDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setEmployeeData(data);
        setEditableData(data); // Initialize editable data with fetched data
        setError(null);
      } else {
        setEmployeeData(null);
        setError('No employee data found for this user.');
      }
      setLoading(false);
    }, (err) => {
      setError('Failed to fetch employee data in real-time.');
      console.error(err);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset editable data if canceling edit
    if (isEditing) {
      setEditableData(employeeData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setEditableData(prevData => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        [name]: value,
      },
    }));
  };

  const handleJobInfoChange = (e) => {
    const { name, value } = e.target;
    setEditableData(prevData => ({
      ...prevData,
      jobInfo: {
        ...prevData.jobInfo,
        [name]: value,
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const employeeDocRef = doc(db, 'employees', user.uid);
        await updateDoc(employeeDocRef, editableData);
        setIsEditing(false);
        setError(null);
      } else {
        setError('No user is currently logged in.');
      }
    } catch (err) {
      setError('Failed to update employee data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  if (!employeeData) {
    return <div className="p-6 text-center text-gray-500">No employee data available.</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="flex flex-col items-center md:flex-row md:items-start gap-8 mb-8">
          <img src={employeeData.photo || 'https://randomuser.me/api/portraits/men/32.jpg'} alt={employeeData.name} className="w-32 h-32 rounded-full border-4 border-indigo-200" />
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-4xl font-bold text-gray-800">{employeeData.name}</h1>
            <p className="text-xl text-gray-600">{employeeData.designation}</p>
            <p className="text-md text-gray-500">{employeeData.department}</p>
            <span className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${employeeData.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {employeeData.status}
            </span>
          </div>
          <div className="md:self-start">
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition duration-300"
                  disabled={loading}
                >
                  <FaSave /> Save
                </button>
                <button
                  onClick={handleEditToggle}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition duration-300"
                  disabled={loading}
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditToggle}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition duration-300"
              >
                <FaEdit /> Edit Profile
              </button>
            )}
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
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editableData.personalInfo?.email || ''}
                    onChange={handlePersonalInfoChange}
                    className="border rounded-md px-2 py-1 w-full"
                  />
                ) : (
                  <p className="text-gray-600">{employeeData.personalInfo?.email}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaPhone className="text-gray-500" />
              <div>
                <p className="font-semibold text-gray-700">Phone</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={editableData.personalInfo?.phone || ''}
                    onChange={handlePersonalInfoChange}
                    className="border rounded-md px-2 py-1 w-full"
                  />
                ) : (
                  <p className="text-gray-600">{employeeData.personalInfo?.phone}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-gray-500" />
              <div>
                <p className="font-semibold text-gray-700">Address</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={editableData.personalInfo?.address || ''}
                    onChange={handlePersonalInfoChange}
                    className="border rounded-md px-2 py-1 w-full"
                  />
                ) : (
                  <p className="text-gray-600">{employeeData.personalInfo?.address}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaBirthdayCake className="text-gray-500" />
              <div>
                <p className="font-semibold text-gray-700">Birth Date</p>
                {isEditing ? (
                  <input
                    type="date"
                    name="birthDate"
                    value={editableData.personalInfo?.birthDate || ''}
                    onChange={handlePersonalInfoChange}
                    className="border rounded-md px-2 py-1 w-full"
                  />
                ) : (
                  <p className="text-gray-600">{employeeData.personalInfo?.birthDate}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Job Information (Read-only for employees) */}
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
                <p className="text-gray-600">{employeeData.jobInfo?.joiningDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaUser className="text-gray-500" />
              <div>
                <p className="font-semibold text-gray-700">Reporting Manager</p>
                <p className="text-gray-600">{employeeData.jobInfo?.reportingManager}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaBriefcase className="text-gray-500" />
              <div>
                <p className="font-semibold text-gray-700">Contract Type</p>
                <p className="text-gray-600">{employeeData.jobInfo?.contractType}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
