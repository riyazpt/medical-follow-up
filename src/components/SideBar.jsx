import React from "react";
import {Link} from "react-router-dom";
import {FaHome, FaUser, FaCog} from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-1/5 h-screen bg-gray-800 text-white">
      <ul className="p-4">
        <li className="mb-6 flex items-center">
          <FaHome className="mr-2" />
          <Link to="/">Home</Link>
        </li>
        <li className="mb-6 flex items-center">
          <FaUser className="mr-2" />
          <Link to="/profile">Patient Profile</Link>
        </li>
        <li className="mb-6 flex items-center">
          <FaUser className="mr-2" />
          <Link to="/feedback">Patient Feedback</Link>
        </li>
        <li className="mb-6 flex items-center">
          <FaCog className="mr-2" />
          <Link to="/settings">Dashboard</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
