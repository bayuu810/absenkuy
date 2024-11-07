import React, { useState } from "react";
import Dasboard from "./Dashboard";
import { RxDashboard } from "react-icons/rx";
import { FaUserFriends, FaBars } from "react-icons/fa";
import Absensi2 from "./Absensi";

function App() {
  const [page, setPage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (page) {
      case "dashboard":
        return <Dasboard />;
      case "absensi2":
        return <Absensi2 />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Tombol Toggle Sidebar */}
      <button
        className="md:hidden p-2 bg-blue-600 text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md mt-20 ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
        <nav className="p-4">
          <ul className="space-y-4">
            <li
              className="text-xl text-black block px-4 py-2 bg-gray-200 cursor-pointer hover:bg-blue-400 rounded"
              onClick={() => {
                setPage("dashboard");
                setIsSidebarOpen(false);
              }}
            >
              <div className="flex items-center space-x-3">
                <RxDashboard />
                <span>Dashboard</span>
              </div>
            </li>
            <li
              className="text-xl text-black block px-4 py-2 bg-gray-200 cursor-pointer hover:bg-blue-400 rounded"
              onClick={() => {
                setPage("absensi2");
                setIsSidebarOpen(false);
              }}
            >
              <div className="flex items-center space-x-3">
                <FaUserFriends />
                <span>Absensi</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 ml-0 md:ml-64 p-4 overflow-auto bg-gray-100">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
