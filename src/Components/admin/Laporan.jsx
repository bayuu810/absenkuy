import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ABSENSI_API_END_POINT, KELAS_API_END_POINT } from '../utils/constant';

const Laporan = () => {
    const [kelas, setKelas] = useState('XII RPL 1');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [attendanceSummary, setAttendanceSummary] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null); // New state for selected student
    const [classList, setClassList] = useState([]); // State to hold class list
const [selectedClass, setSelectedClass] = useState(''); // State to hold selected class
    const token = localStorage.getItem('token'); // Retrieve token

    const handleFilter = async () => {
        console.log(`Filtering data Dari: ${fromDate}, Sampai: ${toDate}, Kelas: ${selectedClass}`);
        
        // Ensure dates are provided
        if (!fromDate || !toDate) {
            alert('Please select both start and end dates.');
            return;
        }
        
        try {
            const response = await axios.get(`${ABSENSI_API_END_POINT}/daterange`, {
                params: {
                    startDate: fromDate,
                    endDate: toDate,
                    classId: selectedClass, // Add classId to params
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.data.success && Array.isArray(response.data.attendance)) {
                // Filter attendance for the selected student if one is chosen
                const filteredAttendances = selectedStudent 
                    ? response.data.attendance.filter(item => item.student.id === selectedStudent)
                    : response.data.attendance;
    
                summarizeAttendance(filteredAttendances);
                console.log(filteredAttendances);
            } else {
                console.error('Unexpected response format:', response.data);
                setAttendanceSummary([]);
            }
        } catch (error) {
            console.error('Error fetching filtered data:', error.response?.data || error.message);
        }
    };
    
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${ABSENSI_API_END_POINT}/list`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.data.success && Array.isArray(response.data.attendance)) {
                    summarizeAttendance(response.data.attendance); // Summarize attendance initially
                    console.log(response.data.attendance);
                } else {
                    console.error('Unexpected response format:', response.data);
                    setAttendanceSummary([]); // Reset to empty if unexpected
                }
            } catch (error) {
                console.error('Error fetching initial data:', error.response?.data || error.message);
            }
        };

        const fetchClasses = async () => {
            try {
                const response = await axios.get(`${KELAS_API_END_POINT}/list`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
    
                if (response.data.success && Array.isArray(response.data.classes)) {
                    setClassList(response.data.classes);
                    setSelectedClass(response.data.classes[0]?.id || ''); // Default to first class if available
                } else {
                    console.error('Unexpected response format:', response.data);
                }
            } catch (error) {
                console.error('Error fetching class data:', error.response?.data || error.message);
            }
        };

        fetchData();
        fetchClasses()
    }, [token]);

    const summarizeAttendance = (attendances) => {
        const summary = {};
    
        attendances.forEach(item => {
            const { student, status } = item;
            if (!student) return; // Skip if there's no student info
    
            const studentId = student.nisn; // Use nisn or student.id based on your structure
            if (!summary[studentId]) {
                summary[studentId] = {
                    fullname: student.fullname || 'N/A',
                    kelas: item.class?.kelas || 'N/A',
                    hadir: 0,
                    sakit: 0,
                    izin: 0,
                    alpa: 0,
                };
            }
    
            // Count attendance statuses
            if (status === 'Hadir') summary[studentId].hadir = 1; // Mark as present
            else if (status === 'Sakit') summary[studentId].sakit = 1; // Mark as sick
            else if (status === 'Izin') summary[studentId].izin = 1; // Mark as on leave
            else if (status === 'Alpa') summary[studentId].alpa = 1; // Mark as absent
        });
    
        // Convert summary object to array
        setAttendanceSummary(Object.values(summary));
    };
    
    

    const handleStudentSelect = (studentId) => {
        setSelectedStudent(studentId);
        // Optionally, you could re-fetch data or summarize immediately
    };

    return (
        <div className="bg-gray-200 min-h-screen p-6 space-y-4">
            <div className="flex flex-col space-y-2">
                <h1 className="text-2xl font-bold">Laporan</h1>
                <span className="text-gray-600">Home / Laporan</span>
            </div>

            <div className="p-4 bg-white shadow rounded-md max-w-xl">
                <h2 className="text-lg font-bold mb-4">Filter laporan</h2>
                <div className="flex items-center space-x-4">
                <div>
                    <label className="block text-gray-700">Kelas</label>
                    <select
                        className="border border-gray-300 rounded py-1 px-2"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        {classList.map((kelas) => (
                            <option key={kelas.id} value={kelas.id}>
                                {kelas.kelas}
                            </option>
                        ))}
                    </select>
                </div>

                    <div>
                        <label className="block text-gray-700">Dari</label>
                        <input
                            type="date"
                            className="border border-gray-300 rounded py-1 px-2"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Sampai</label>
                        <input
                            type="date"
                            className="border border-gray-300 rounded py-1 px-2"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="mt-6">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleFilter}
                    >
                        Filter
                    </button>
                </div>
            </div>

            {/* Tabel */}
            <div className="overflow-x-auto bg-white shadow rounded-md">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr className="bg-white text-left text-black uppercase text-sm">
                            <th className="py-3 px-6 border-b border-gray-300">No</th>
                            <th className="py-3 px-6 border-b border-gray-300">Full Name</th>
                            <th className="py-3 px-6 border-b border-gray-300">Kelas</th>
                            <th className="py-3 px-6 border-b border-gray-300">Hadir</th>
                            <th className="py-3 px-6 border-b border-gray-300">Sakit</th>
                            <th className="py-3 px-6 border-b border-gray-300">Izin</th>
                            <th className="py-3 px-6 border-b border-gray-300">Alpa</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {attendanceSummary.length > 0 ? (
                            attendanceSummary.map((item, index) => (
                                <tr key={index} className="border-b hover:bg-gray-100">
                                    <td className="py-3 px-6">{index + 1}</td>
                                    <td className="py-3 px-6">{item.fullname}</td>
                                    <td className="py-3 px-6">{item.kelas}</td>
                                    <td className="py-3 px-6">{item.hadir}</td>
                                    <td className="py-3 px-6">{item.sakit}</td>
                                    <td className="py-3 px-6">{item.izin}</td>
                                    <td className="py-3 px-6">{item.alpa}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="py-3 px-6 text-center">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Laporan;
