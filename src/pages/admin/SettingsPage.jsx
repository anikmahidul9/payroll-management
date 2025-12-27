import React from 'react';

const SettingsPage = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Company Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">Company Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input type="text" id="company-name" defaultValue="PayRoll Inc." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                <div>
                  <label htmlFor="company-address" className="block text-sm font-medium text-gray-700">Address</label>
                  <input type="text" id="company-address" defaultValue="123 Business Rd, Suite 100, Anytown, USA" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                <div>
                  <label htmlFor="company-email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id="company-email" defaultValue="contact@payrollinc.com" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
              </div>
            </div>

            {/* Payroll Settings */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">Payroll Settings</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="pay-frequency" className="block text-sm font-medium text-gray-700">Pay Frequency</label>
                  <select id="pay-frequency" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <option>Monthly</option>
                    <option>Bi-Weekly</option>
                    <option>Weekly</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="pay-day" className="block text-sm font-medium text-gray-700">Pay Day</label>
                  <input type="number" id="pay-day" min="1" max="31" defaultValue="28" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">Notification Settings</h2>
              <div className="flex items-center">
                <input id="email-notifications" type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-900">Enable Email Notifications</label>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-300">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
