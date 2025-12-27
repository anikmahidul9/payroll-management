import React, { useState } from 'react';
import { FaBell, FaUserCircle, FaCog, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { Transition } from '@headlessui/react';

const Navbar = ({ toggleSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-sm shadow-md lg:left-64">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section: Hamburger Menu (Mobile) and Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-600 hover:text-indigo-600"
            aria-label="Open sidebar"
          >
            <FaBars className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 tracking-wider hidden sm:block">
            <span className="text-indigo-600">Employee</span>Panel
          </h1>
        </div>

        {/* Right Section: Icons and User Menu */}
        <div className="flex items-center gap-6">
          {/* Notification Bell */}
          <button
            type="button"
            className="relative rounded-full p-2 text-gray-500 transition-colors duration-300 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
            <span className="sr-only">View notifications</span>
            <FaBell className="h-6 w-6" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="flex items-center gap-3 rounded-full bg-transparent p-1 text-gray-600 transition-colors duration-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="h-9 w-9 rounded-full object-cover border-2 border-gray-200 group-hover:border-indigo-500"
                src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                alt="User avatar"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">John Doe</p>
                <p className="text-xs text-gray-500">Employee</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            <Transition
              show={isMenuOpen}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-100"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div
                className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
              >
                <div className="border-b border-gray-200 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-800">John Doe</p>
                  <p className="text-xs text-gray-500 truncate">john.doe@example.com</p>
                </div>
                <div className="py-1">
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <FaUserCircle className="h-5 w-5 text-gray-500" />
                    <span>Your Profile</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <FaCog className="h-5 w-5 text-gray-500" />
                    <span>Settings</span>
                  </a>
                </div>
                <div className="py-1 border-t border-gray-200">
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    role="menuitem"
                  >
                    <FaSignOutAlt className="h-5 w-5" />
                    <span>Sign out</span>
                  </a>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
