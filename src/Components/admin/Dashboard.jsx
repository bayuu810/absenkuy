import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserFriends } from "react-icons/fa";
import { MdOutlineSick, MdMenuBook } from "react-icons/md";
import { BsEmojiWink, BsEmojiExpressionless, BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import { ABSENSI_API_END_POINT, KELAS_API_END_POINT, SISWA_API_END_POINT } from "../utils/constant";

function Dashboard() {
  const [yesterdayAbsensi, setYesterdayAbsensi] = useState([]);
  const [todayAbsensi, setTodayAbsensi] = useState([]);
  const [weekrecap, setWeekrecap] = useState({}); // Perbarui menjadi objek
  const [students, setStudents] = useState([]); // New state for students
  const [classes, setClasses] = useState([])
  const [notAbsen, setNotAbsen] = useState([])

  const fetchTodayAbsensi = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${ABSENSI_API_END_POINT}/today`, { headers });
      if (response.data) {
        console.log("Data Kehadiran Hari Ini:", response.data);
        setTodayAbsensi(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching yesterday's attendance:", error);
    }
  };

  const fetchYesterdayAbsensi = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${ABSENSI_API_END_POINT}/yesterday`, { headers });
      if (response.data) {
        console.log("Data Kehadiran Kemarin:", response.data);
        setYesterdayAbsensi(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching weekly attendance:", error);
    }
  };

  const fetchWeekRecap = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${ABSENSI_API_END_POINT}/dashboard`, { headers });
      if (response.data) {
        console.log("Data Rekap Mingguan:", response.data);
        setWeekrecap(response.data.data || {}); // Menyimpan data sebagai objek
      }
    } catch (error) {
      console.error("Error fetching weekly recap:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${SISWA_API_END_POINT}/list`, { headers });
      console.log("Data Siswa:", response.data); // Log data siswa
      setStudents(response.data.data || []);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };
  
  

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${KELAS_API_END_POINT}/list`, { headers });
      if (response.data) {
        console.log("Data Kelas:", response.data);
        setClasses(response.data.classes || []); // Set class data
      }
    } catch (error) {
      console.error("Error fetching class data:", error);
    }
  };
  const fetchNotAbsen = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${ABSENSI_API_END_POINT}/hout`, { headers });
      if (response.data) {
        console.log("Data belum absen:", response.data);
        setNotAbsen(response.data.data || []); // Set class data
      }
    } catch (error) {
      console.error("Error fetching class data:", error);
    }
  };


  useEffect(() => {
    fetchTodayAbsensi();
    fetchYesterdayAbsensi();
    fetchWeekRecap();
    fetchStudents()
    fetchClasses()
    fetchNotAbsen()
  }, []);

  console.log(classes.length)
  return (
    <div className="bg-gray-200 px-4 py-6">
      <div className="text-black text-3xl font-bold mb-1">Dashboard</div>
      <div className="text-black text-md mb-6">Home/Dashboard</div>
      <div className='grid grid-cols-2 gap-4'>
        {/* Card 1 - Siswa */}
        <Link to="/Siswa" className="block">
          <div className="bg-white shadow rounded-lg p-6 mb-6 relative hover:bg-gray-100 transition-colors">
            <div className="absolute top-2 right-2">
              <BsThreeDots className="text-3xl text-gray-600" />
            </div>
            <div className="flex items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-semibold text-black mb-2">Siswa</h3>
                <div className="flex items-center space-x-2">
                  <div className="border-2 border-gray-600 p-2 rounded">
                    <FaUserFriends className="text-3xl" />
                  </div>
                  <p className="text-4xl font-bold text-indigo-600">{students.length}</p> {/* Update to use students */}
                </div>
                <h3 className="text-lg font-semibold text-green-500 mb-2 flex items-center">
                  Dari
                  <p className="ml-2 text-gray-500">{classes.length} Kelas</p>
                </h3>
              </div>
            </div>
          </div>
        </Link>

        <div className="bg-white shadow rounded-lg p-6 mb-6 relative">
          <div className="absolute top-2 right-2">
          </div>
          <div className="flex items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center">
                Hadir
                <p className='ml-2 text-black'>| Bulan Ini</p>
              </h3>
              <div className="flex items-center space-x-2">
                <div className="text-3xl border-2 border-gray-600 p-2 rounded-full">
                  <BsEmojiWink className='text-3xl' />
                </div>
                <p className="text-4xl font-bold text-blue-600">
                  {weekrecap.Hadir || 0}
                </p>
              </div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2 flex items-center">
                Total
                <p className="text-xl text-gray-500 ml-2">{students.length} Siswa</p>
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        {/* Card 2 - Sakit */}
        <div className="bg-white shadow rounded-lg p-6 mb-6 relative">
          <div className="absolute top-2 right-2">
          </div>
          <div className="flex items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2 flex items-center">
                Sakit
                <p className="ml-2 text-black">| Bulan Ini</p>
              </h3>
              <div className="flex items-center space-x-2">
                <div className="text-3xl border-2 border-gray-600 p-2 rounded-full">
                  <MdOutlineSick className='text-3xl' />
                </div>
                <p className="text-4xl font-bold text-blue-600">
                  {weekrecap.Sakit || 0}
                </p>
              </div>
              <h3 className="text-lg font-semibold text-green-500 mb-2 flex items-center">
                Total
                <span className="text-xl text-gray-400 ml-2">{students.length} Siswa</span>
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 relative">
          <div className="absolute top-2 right-2">
          </div>
          <div className="flex items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2 flex items-center">
                Izin
                <p className='ml-2 text-black'>| Bulan Ini</p>
              </h3>
              <div className="flex items-center space-x-2">
                <div className="text-3xl border-2 border-gray-600 p-2 rounded-full">
                  <BsEmojiWink className='text-3xl' />
                </div>  
                <p className="text-4xl font-bold text-blue-600">
                  {weekrecap.Izin || 0}
                </p>
              </div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2 flex items-center">
                Total
                <p className="text-xl text-gray-500 ml-2">{students.length} Siswa</p>
              </h3>
            </div>
          </div>
        </div>

        {/* Card 4 - Alpa */}
        <div className="bg-white shadow rounded-lg p-6 relative">
          <div className="absolute top-2 right-2">
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2 flex items-center">
                Alpa
                <p className='ml-2 text-black'>| Bulan Ini</p>
              </h3>
              <div className="flex items-center space-x-2">
                <div className="text-3xl border-2 border-gray-600 p-2 rounded-full">
                  <BsEmojiExpressionless className='text-3xl' />
                </div>
                <p className="text-4xl font-bold text-blue-600">
                  {weekrecap.Alpa || 0}
                </p>
              </div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2 flex items-center">
                Total
                <p className="text-xl text-gray-500 ml-2">{students.length} Siswa</p>
              </h3>
            </div>
          </div>
        </div>
      </div>


      <div className="flex flex-col bg-white my-5">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <h1 className="font-medium ml-3 text-xl">Data Absen Hari Ini</h1>
              <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
                  <tr>
                    <th scope="col" className="px-6 py-4">No</th>
                    <th scope="col" className="px-6 py-4">Nama</th>
                    <th scope="col" className="px-6 py-4">Kelas</th>
                    <th scope="col" className="px-6 py-4">NIS</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                {todayAbsensi.map((attendance, index) => {
  const student = attendance.student || {}; // Pastikan student ada
  const classInfo = attendance.class || {}; // Pastikan class ada
  return (
    <tr key={attendance.id} className="border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100">
      <td className="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
      <td className="whitespace-nowrap px-6 py-4">{student.fullname || 'N/A'}</td>
      <td className="whitespace-nowrap px-6 py-4">{classInfo.kelas || 'N/A'}</td>
      <td className="whitespace-nowrap px-6 py-4">{student.nisn || 'N/A'}</td>
      <td className="whitespace-nowrap px-6 py-4">{attendance.status || 'N/A'}</td>
    </tr>
  );
})}


                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 flex-row justify-between">
        <div className="flex flex-col w-full gap-4 bg-white">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <h1 className="font-medium ml-3 text-xl">Data Absen kemarin</h1>
                <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                  <thead className="border-b bg-gray-300 border-neutral-200 font-medium dark:border-white/10">
                    <tr>
                      <th scope="col" className="px-6 py-4">No</th>
                      <th scope="col" className="px-6 py-4">Nama</th>
                      <th scope="col" className="px-6 py-4">Kelas</th>
                      <th scope="col" className="px-6 py-4">NIS</th>
                      <th scope="col" className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yesterdayAbsensi.map((attendance, index) => (
                      <tr key={attendance.id} className="border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-600">
                        <td className="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
                        <td className="whitespace-nowrap px-6 py-4">{attendance.student.fullname}</td>
                        <td className="whitespace-nowrap px-6 py-4">{attendance.class.kelas}</td>
                        <td className="whitespace-nowrap px-6 py-4">{attendance.student.nisn}</td>
                        <td className="whitespace-nowrap px-6 py-4">{attendance.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full max-w-[300px] bg-white">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <h1 className="font-medium ml-3 text-xl my-3">Data Belum Absen</h1>
                <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                  <thead className="border bg-white border-neutral-200 font-medium dark:border-white/10">
                    <tr>
                      <th scope="col" className="px-6 py-4">No</th>
                      <th scope="col" className="px-6 py-4">Kelas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notAbsen.map((attendance, index) => (
                      <tr key={attendance.id} className="border border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-600">
                        <td className="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
                        <td className="whitespace-nowrap px-6 py-4">{attendance.className}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
