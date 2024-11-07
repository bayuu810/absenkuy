import React, { useState } from "react";
import Siswa from "./admin/Siswa";
import Kelas from "./admin/Kelas";
import Laporan from "./admin/Laporan";
import { RxDashboard } from "react-icons/rx";
import { BiSolidUserDetail } from "react-icons/bi";
import { FaUserFriends } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { GiNotebook } from "react-icons/gi";
import Users from "./admin/users";
import Dasboard from "./admin/Dashboard";
import Navbar from "./shared/Navbar"; 

function App() {
  const [page, setPage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 

  const renderContent = () => {
    switch (page) {
      case "dashboard":
        return <Dasboard isSidebarOpen={isSidebarOpen} />; 
      case "siswa":
        return <Siswa />;
      case "kelas":
        return <Kelas />;
      case "users":
        return <Users />;
      case "laporan":
        return <Laporan />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-md fixed h-full transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <nav className="p-4 pt-24">
          <ul className="space-y-4">
            <li
              className={`text-xl text-gray-600 block px-4 py-2 cursor-pointer hover:bg-blue-400 ${
                page === "dashboard" ? "bg-blue-200" : "bg-gray-200"
              }`}
              onClick={() => setPage("dashboard")}
            >
              <div className="flex items-center space-x-3">
                <RxDashboard />
                {isSidebarOpen && <span>Dashboard</span>}
              </div>
            </li>
            <li
              className={`text-xl text-gray-600 block px-4 py-2 cursor-pointer hover:bg-blue-400 ${
                page === "siswa" ? "bg-blue-200" : "bg-gray-200"
              }`}
              onClick={() => setPage("siswa")}
            >
              <div className="flex items-center space-x-3">
                <FaUserFriends />
                {isSidebarOpen && <span>Siswa</span>}
              </div>
            </li>
            <li
              className={`text-xl text-gray-600 block px-4 py-2 cursor-pointer hover:bg-blue-400 ${
                page === "kelas" ? "bg-blue-200" : "bg-gray-200"
              }`}
              onClick={() => setPage("kelas")}
            >
              <div className="flex items-center space-x-3">
                <IoHome />
                {isSidebarOpen && <span>Kelas</span>}
              </div>
            </li>
            <li
              className={`text-xl text-gray-600 block px-4 py-2 cursor-pointer hover:bg-blue-400 ${
                page === "users" ? "bg-blue-200" : "bg-gray-200"
              }`}
              onClick={() => setPage("users")}
            >
              <div className="flex items-center space-x-3">
                <BiSolidUserDetail />
                {isSidebarOpen && <span>Users</span>}
              </div>
            </li>
            <li
              className={`text-xl text-gray-600 block px-4 py-2 cursor-pointer hover:bg-blue-400 ${
                page === "laporan" ? "bg-blue-200" : "bg-gray-200"
              }`}
              onClick={() => setPage("laporan")}
            >
              <div className="flex items-center space-x-3">
                <GiNotebook />
                {isSidebarOpen && <span>Laporan</span>}
              </div>
            </li>
          </ul>
        </nav>
      </div>

      {/* Navbar */}
      <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'} p-4 pt-24 overflow-y-auto`}>
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Content Area */}
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
