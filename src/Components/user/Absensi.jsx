import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ABSENSI_API_END_POINT, SISWA_API_END_POINT } from '../utils/constant';

function Absensi() {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 3;
  const [searchTerm, setSearchTerm] = useState('');
  const [allPresentMessage, setAllPresentMessage] = useState(false);
  const [initialToast, setInitialToast] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const totalPages = Math.ceil(students.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;

  const filteredStudents = students.filter((student) =>
    student.fullname && student.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`${SISWA_API_END_POINT}/byUserId`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((response) => {
      if (response.data.success) {
        const mappedStudents = response.data.data.map(student => ({
          id: student.id,
          fullname: student.fullname,
          nisn: student.nisn,
          gender: student.jenis_kelamin,
          status: 'Hadir', // Set default status to 'Hadir'
        }));

        setStudents(mappedStudents);
      } else {
        setErrorMessage(response.data.message);
      }
    })
    .catch((error) => {
      console.error("Error fetching attendance data:", error);
      setStudents([]);
      setErrorMessage("Gagal mengambil data absensi. Silakan coba lagi.");
    });
  }, []);

  const handleStatusChange = (studentId, status) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.id === studentId) {
          return { ...student, status }; // Update status directly
        }
        return student;
      })
    );
  };

  const handleStudentSelection = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const handleSubmit = () => {
    const token = localStorage.getItem('token');
    const selectedData = students.filter((student) => selectedStudents.includes(student.id));
    const attendancePromises = selectedData.map((student) => {
      const attendanceData = {
        studentId: student.id,
        status: student.status || 'Hadir',
      };

      return axios.post(`${ABSENSI_API_END_POINT}/mark`, attendanceData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    });

    Promise.all(attendancePromises)
      .then((responses) => {
        const allPresent = responses.every(response => response.data.success && response.data.attendance.status === 'Hadir');
        setAllPresentMessage(allPresent);
        alert("Absensi berhasil disimpan!");
        setErrorMessage('');
      })
      .catch((error) => {
        console.error("Error saving attendance:", error);
        setErrorMessage("Gagal menyimpan absensi. Silakan coba lagi.");
      });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialToast(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto pt-16 p-6 space-y-4">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Absensi</h1>
        <span className="text-gray-600">Home / Absensi</span>
      </div>

      {initialToast && (
        <div className="p-4 bg-red-300 text-white rounded">
          Klik simpan jika sudah melakukan Absensi!
        </div>
      )}

      {allPresentMessage && (
        <div className="p-4 bg-green-300 text-white rounded">
          Semua siswa hadir!
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-500 text-white rounded">
          {errorMessage}
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow rounded-md">
        <div className="p-4">
          <h2 className="text-xl font-bold">Absensi Kelas X RPL</h2>
          <p className="text-sm">Tanggal 2023-04-06</p>
        </div>

        <div className="flex justify-end pr-20 mb-4 items-center">
          <span className='font-semibold text-gray-400 mr-1'>SEARCH :</span>
          <input
            type="text"
            placeholder="Cari Nama Siswa..."
            className="border-black border rounded py-2 px-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="text-left uppercase text-sm text-gray-700 bg-white">
              <th className="py-3 px-6">Pilih</th>
              <th className="py-3 px-6">No</th>
              <th className="py-3 px-6">Nama</th>
              <th className="py-3 px-6">Status</th>
            </tr>
            <tr>
              <td colSpan="4">
                <hr className="border-t border-gray-300" />
              </td>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {currentStudents.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Tidak ada siswa yang ditemukan
                </td>
              </tr>
            ) : (
              currentStudents.map((student, index) => (
                <tr key={student.id} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-6">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentSelection(student.id)}
                    />
                  </td>
                  <td className="py-3 px-6">{index + 1}</td>
                  <td className="py-3 px-6">{student.fullname}</td>
                  <td className="py-3 px-6">
                    <div className="flex space-x-4">
                      <label>
                        <input
                          type="radio"
                          name={`status${student.id}`}
                          value="Hadir"
                          checked={student.status === 'Hadir'}
                          onChange={() => handleStatusChange(student.id, 'Hadir')}
                        />
                        <span className="ml-2">Hadir</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`status${student.id}`}
                          value="Sakit"
                          checked={student.status === 'Sakit'}
                          onChange={() => handleStatusChange(student.id, 'Sakit')}
                        />
                        <span className="ml-2">Sakit</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`status${student.id}`}
                          value="Izin"
                          checked={student.status === 'Izin'}
                          onChange={() => handleStatusChange(student.id, 'Izin')}
                        />
                        <span className="ml-2">Izin</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`status${student.id}`}
                          value="Tidak Hadir"
                          checked={student.status === 'Tidak Hadir'}
                          onChange={() => handleStatusChange(student.id, 'Tidak Hadir')}
                        />
                        <span className="ml-2">Tidak Hadir</span>
                      </label>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex justify-between py-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Simpan
          </button>
          <div>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 px-3 py-1 rounded ${index + 1 === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Absensi;
