import React, { useState, useEffect } from "react";
import axios from "axios";
import { ABSENSI_API_END_POINT } from "../utils/constant";

const Dashboard = () => {
  const [todayAbsensi, setTodayAbsensi] = useState([]);
  const [yesterdayAbsensi, setYesterdayAbsensi] = useState([]);
  
  const [searchToday, setSearchToday] = useState("");
  const [searchYesterday, setSearchYesterday] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
  
        // Fetch today's attendance
        const todayResponse = await axios.get(`${ABSENSI_API_END_POINT}/todayUser`, config);
        if (todayResponse.data.success) {
          console.log("Today's attendance data:", todayResponse.data.data); // Log the response
          setTodayAbsensi(todayResponse.data.data); // Ensure we're setting the correct data
        } else {
          setErrorMessage(todayResponse.data.message);
        }
  
        // Fetch yesterday's attendance
        const yesterdayResponse = await axios.get(`${ABSENSI_API_END_POINT}/yesterdayUser`, config);
        if (yesterdayResponse.data.success) {
          console.log("Yesterday's attendance data:", yesterdayResponse.data.data); // Log the response
          setYesterdayAbsensi(yesterdayResponse.data.data);
        }
  
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setErrorMessage("Failed to fetch attendance data.");
      }
    };
  
    fetchData();
  }, []);
  

 const filterData = (data, searchTerm) => {
  return data.filter(item =>
    item.student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.class.kelas.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

  const filteredTodayData = filterData(todayAbsensi, searchToday);
  const filteredYesterdayData = filterData(yesterdayAbsensi, searchYesterday);

  console.log(filteredTodayData)
  return (
    <div className="min-h-screen bg-gray-200 p-4 md:p-8">
      <div className="text-black text-3xl font-bold mb-2">Dashboard</div>
      <div className="text-black text-md mb-6">Home / Dashboard</div>

      {errorMessage && (
        <div className="p-4 bg-red-500 text-white rounded mb-4">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Absensi Hari Ini */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-lg font-semibold mb-2">Absensi Hari Ini</h2>
            </div>
            <div className="flex items-center">
              <label className='font-semibold text-gray-700 mr-1'>Search:</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                value={searchToday}
                onChange={(e) => setSearchToday(e.target.value)}
                placeholder=""
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-2 text-center">No</th>
                  <th className="p-2 text-center">Nama</th>
                  <th className="p-2 text-center">Kelas</th>
                  <th className="p-2 text-center">Keterangan</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {filteredTodayData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">Tidak ada data absensi hari ini</td>
                  </tr>
                ) : (
                  filteredTodayData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-100">
                      <td className="py-3 px-6 text-center">{index + 1}</td>
                      <td className="py-3 px-6 text-center">{item.student.fullname}</td>
                      <td className="py-3 px-6 text-center">{item.class.kelas}</td>
                      <td className="py-3 px-6 text-center">{item.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Absensi Kemarin */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-lg font-semibold mb-2">Absensi Kemarin</h2>
            </div>
            <div className="flex items-center">
              <label className='font-semibold text-gray-700 mr-1'>Search:</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                value={searchYesterday}
                onChange={(e) => setSearchYesterday(e.target.value)}
                placeholder=""
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-2 text-center">No</th>
                  <th className="p-2 text-center">Nama</th>
                  <th className="p-2 text-center">Kelas</th>
                  <th className="p-2 text-center">Keterangan</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {filteredYesterdayData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">Tidak ada data absensi kemarin</td>
                  </tr>
                ) : (
                  filteredYesterdayData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-100">
                      <td className="py-3 px-6 text-center">{index + 1}</td>
                      <td className="py-3 px-6 text-center">{item.student.fullname}</td>
                      <td className="py-3 px-6 text-center">{item.class.kelas}</td>
                      <td className="py-3 px-6 text-center">{item.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
