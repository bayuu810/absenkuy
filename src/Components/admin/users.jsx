import React, { useState, useEffect } from 'react';
import { FaPlusCircle } from "react-icons/fa";
import axios from 'axios';
import { KELAS_API_END_POINT, USER_API_END_POINT } from '../utils/constant';

function Users() {
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([]); // Pastikan ini adalah array
    const [classes, setClasses] = useState([]); // Menyimpan data kelas
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [formData, setFormData] = useState({ fullname: '', nisn: '', jenis_kelamin: '', role: '', password: '', classId: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${USER_API_END_POINT}/list`);
                if (response.data && Array.isArray(response.data.data)) {
                    setStudents(response.data.data);
                } else {
                    console.error('Response data is not an array:', response.data);
                    setStudents([]);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const fetchClasses = async () => {
            try {
                const response = await axios.get(`${KELAS_API_END_POINT}/list`);
                if (response.data && Array.isArray(response.data.classes)) {
                    setClasses(response.data.classes.map((kelas) => ({
                        id: kelas.id, // Ambil ID kelas
                        name: kelas.kelas // Ambil nama kelas dari properti "kelas"
                    })));
                } else {
                    console.error('Response data for classes is not an array:', response.data);
                    setClasses([]);
                }
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        fetchUsers();
        fetchClasses(); // Panggil fungsi untuk mengambil kelas
    }, []);

    const handleAddUser = () => {
        setIsModalVisible(true);
        setEditIndex(null);
        setFormData({ fullname: '', nisn: '', jenis_kelamin: '', role: '', password: '', classId: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (formData.password.length < 6) {
            alert('Password harus minimal 6 karakter!');
            return;
        }
    
        if (formData.role === 'user' && !formData.classId) {
            alert('Kelas harus diisi untuk role User!');
            return;
        }
    
        try {
            // Ambil token dari localStorage
            const token = localStorage.getItem('token');
    
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`, // Tambahkan token di header
                },
            };
    
            if (editIndex !== null) {
                const studentToUpdate = students[editIndex];
                if (studentToUpdate && studentToUpdate.id) {
                    const response = await axios.put(`${USER_API_END_POINT}/${studentToUpdate.id}`, formData, config);
                    const updatedStudents = [...students];
                    updatedStudents[editIndex] = response.data;
                    setStudents(updatedStudents);
                } else {
                    console.error('ID pengguna tidak ditemukan untuk pembaruan.');
                }
            } else {
                const response = await axios.post(`${USER_API_END_POINT}/register`, formData, config);
                setStudents([...students, response.data]);
            }
    
            setIsModalVisible(false);
            setFormData({ fullname: '', nisn: '', jenis_kelamin: '', role: '', password: '', classId: '' });
            setEditIndex(null);
        } catch (error) {
            console.error('Error saving user:', error.response ? error.response.data : error.message);
        }
    };
    
    

    const  handleEditUser = (index) => {
        setIsModalVisible(true);
        setEditIndex(index);
        setFormData({ ...students[index], password: '' });
    };

    const handleDeleteUser = async (index) => {
        const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?');
        if (!confirmDelete) return;

        try {
            const studentToDelete = students[index];
            if (!studentToDelete || !studentToDelete.id) {
                console.error('ID pengguna tidak ditemukan untuk penghapusan.');
                return;
            }

            const token = localStorage.getItem('token');
            await axios.delete(`${USER_API_END_POINT}/${studentToDelete.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const updatedStudents = students.filter((_, i) => i !== index);
            setStudents(updatedStudents);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const filteredStudents = Array.isArray(students) ? students.filter((student) =>
        student.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nisn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.jenis_kelamin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.role?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const indexOfLastStudent = currentPage * itemsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

    return (
        <div className="bg-gray-200 min-h-screen p-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-2xl font-bold text-black">Data Users</h1>
                <span className="text-gray-700">Home / Data Users</span>
            </div>

            <div className="flex space-x-4 my-4">
                <button
                    className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
                    onClick={handleAddUser}
                >
                    <FaPlusCircle />
                    <span>Tambah Users</span>
                </button>
            </div>

            <div className="flex justify-end">
                <div className='min-w-[300px]'>
                    <span className='font-semibold text-gray-700 mr-1'>Search:</span>
                    <input
                        type="text"
                        className="border border-gray-300 rounded py-1 px-2 text-sm mr-4"
                        placeholder="Cari users"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto mt-4">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr className="w-full bg-white text-left text-black uppercase text-sm leading-normal">
                            <th className="py-3 px-6 border-b border-gray-300">No</th>
                            <th className="py-3 px-6 border-b border-gray-300">Nama</th>
                            <th className="py-3 px-6 border-b border-gray-300">NISN</th>
                            <th className="py-3 px-6 border-b border-gray-300">Jenis Kelamin</th>
                            <th className="py-3 px-6 border-b border-gray-300">Role</th>
                            <th className="py-3 px-6 border-b border-gray-300">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {currentStudents.length > 0 ? (
                            currentStudents.map((student, index) => (
                                <tr key={student.nisn || index} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left">{indexOfFirstStudent + index + 1}</td>
                                    <td className="py-3 px-6 text-left">{student.fullname}</td>
                                    <td className="py-3 px-6 text-left">{student.nisn}</td>
                                    <td className="py-3 px-6 text-left">{student.jenis_kelamin}</td>
                                    <td className="py-3 px-6 text-left">{student.role}</td>
                                    <td className="py-3 px-6 text-left">
                                        <div className="flex space-x-2">
                                            <button
                                                className="bg-blue-500 text-white py-1 px-2 rounded"
                                                onClick={() => handleEditUser(indexOfFirstStudent + index)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white py-1 px-2 rounded"
                                                onClick={() => handleDeleteUser(indexOfFirstStudent + index)}
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-3 px-6 text-center">Tidak ada data users yang cocok.</td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600">
                    Menampilkan {indexOfFirstStudent + 1} - {Math.min(indexOfLastStudent, filteredStudents.length)} dari {filteredStudents.length} data users
                </span>
                <div className="flex space-x-2">
                    <button
                        className="py-1 px-2 border border-gray-300 rounded disabled:opacity-50"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Sebelumnya
                    </button>
                    <button
                        className="py-1 px-2 border border-gray-300 rounded disabled:opacity-50"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Berikutnya
                    </button>
                </div>
            </div>

            {isModalVisible && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-bold mb-4">{editIndex !== null ? 'Edit User' : 'Tambah User'}</h2>
                  <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                          <label className="block text-gray-700 mb-1">Nama</label>
                          <input
                              type="text"
                              className="border border-gray-300 rounded py-2 px-3 w-full"
                              value={formData.fullname}
                              onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                              required
                          />
                      </div>
                      <div className="mb-4">
                          <label className="block text-gray-700 mb-1">NISN</label>
                          <input
                              type="text"
                              className="border border-gray-300 rounded py-2 px-3 w-full"
                              value={formData.nisn}
                              onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                              required
                          />
                      </div>
                      <div className="mb-4">
                          <label className="block text-gray-700 mb-1">Jenis Kelamin</label>
                          <select
                              className="border border-gray-300 rounded py-2 px-3 w-full"
                              value={formData.jenis_kelamin}
                              onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}
                              required
                          >
                              <option value="">Pilih Jenis Kelamin</option>
                              <option value="Laki-laki">Laki-laki</option>
                              <option value="Perempuan">Perempuan</option>
                          </select>
                      </div>
                      <div className="mb-4">
                          <label className="block text-gray-700 mb-1">Role</label>
                          <select
                              className="border border-gray-300 rounded py-2 px-3 w-full"
                              value={formData.role}
                              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                              required
                          >
                              <option value="">Pilih Role</option>
                              <option value="admin">Admin</option>
                              <option value="user">User</option>
                          </select>
                      </div>
                      {formData.role === 'user' && (
                          <div className="mb-4">
                              <label className="block text-gray-700 mb-1">Kelas</label>
                              <select
                                  className="border border-gray-300 rounded py-2 px-3 w-full"
                                  value={formData.classId}
                                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                  required
                              >
                                  <option value="">Pilih Kelas</option>
                                  {classes.map((kelas) => (
                                      <option key={kelas.id} value={kelas.id}>
                                          {kelas.name}
                                      </option>
                                  ))}
                              </select>
                          </div>
                      )}
                      <div className="mb-4">
                          <label className="block text-gray-700 mb-1">Password</label>
                          <input
                              type={showPassword ? 'text' : 'password'}
                              className="border border-gray-300 rounded py-2 px-3 w-full"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              required
                          />
                          <button
                              type="button"
                              className="text-blue-500 mt-1"
                              onClick={() => setShowPassword(!showPassword)}
                          >
                              {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                          </button>
                      </div>
                      <div className="flex justify-end">
                          <button
                              type="button"
                              className="mr-2 py-2 px-4 bg-gray-300 rounded"
                              onClick={() => setIsModalVisible(false)}
                          >
                              Batal
                          </button>
                          <button
                              type="submit"
                              className="py-2 px-4 bg-blue-600 text-white rounded"
                          >
                              {editIndex !== null ? 'Simpan' : 'Tambah'}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
          
            )}
        </div>
    );
}

export default Users;
