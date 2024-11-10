import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false); // Controls dropdown visibility
  const dropdownRef = useRef(null); // Reference to the dropdown container
  const navigate = useNavigate();

  // Toggles dropdown visibility when profile button is clicked
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Navigate to Help page
  const handleHelpClick = () => {
    navigate("/dashboard/help"); // Redirect to the Help page
  };

  // Sign-out function
  const signOutHandler = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  // Closes dropdown if clicked outside the dropdown area
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // Adds event listener for detecting outside clicks, removes it on component unmount
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Profile Button displaying the username */}
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 bg-gray-300 rounded-full"
      >
        {user?.firstName?.toUpperCase() || "User"}{" "}
        {/* Displays 'User' if firstname is unavailable */}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20">
          <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer">
            Profile
          </div>
          <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer">
            Transaction History
          </div>
          <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer">
            Settings
          </div>
          <div
            onClick={handleHelpClick} // Redirects to Help page on click
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer"
          >
            Help
          </div>
          <div
            onClick={signOutHandler}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer"
          >
            Log Out
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
