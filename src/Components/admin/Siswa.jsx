import React, { useState, useEffect } from 'react';
import { IoPersonAddSharp } from "react-icons/io5";
import axios from 'axios';
import { toast } from 'sonner';
import { SISWA_API_END_POINT, KELAS_API_END_POINT } from '../utils/constant';

function Siswa() {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({ fullname: '', nisn: '', classId: '', jenis_kelamin: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`${SISWA_API_END_POINT}/list`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success && Array.isArray(response.data.data)) {
                    setStudents(response.data.data);
                } else {
                    setStudents([]);
                }
            } catch (err) {
                setError(err);
                toast.error('Failed to fetch student data.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [token]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get(`${KELAS_API_END_POINT}/list`);
                if (response.data && Array.isArray(response.data.classes)) {
                    setClasses(response.data.classes.map((kelas) => ({
                        id: kelas.id,
                        name: kelas.kelas
                    })));
                } else {
                    setClasses([]);
                }
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        fetchClasses();
    }, []);

    const handleAddSiswa = () => {
        setIsModalVisible(true);
        setEditIndex(null);
        setFormData({ fullname: '', nisn: '', classId: '', jenis_kelamin: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editIndex === null) {
            await handleAddNewSiswa();
        } else {
            await handleUpdateSiswa();
        }
    };

    const handleAddNewSiswa = async () => {
        const trimmedKelas = formData.classId.trim();

        if (!formData.fullname || !formData.nisn || !trimmedKelas || !formData.jenis_kelamin) {
            toast.error('Semua field harus diisi!');
            return;
        }

        try {
            const response = await axios.post(`${SISWA_API_END_POINT}/create`, {
                ...formData,
                classId: trimmedKelas // Menggunakan ID kelas
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setStudents((prev) => [...prev, response.data.data]);
                toast.success('Siswa berhasil ditambahkan!');
            } else {
                toast.error(response.data.message || 'Gagal menambahkan siswa.');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menambahkan siswa.');
        } finally {
            setIsModalVisible(false);
            setFormData({ fullname: '', nisn: '', classId: '', jenis_kelamin: '' });
        }
    };

    const handleUpdateSiswa = async () => {
        try {
            const response = await axios.put(`${SISWA_API_END_POINT}/${students[editIndex].id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setStudents((prev) =>
                    prev.map((student, index) => (index === editIndex ? response.data.data : student))
                );
                toast.success('Siswa berhasil diperbarui!');
            } else {
                toast.error(response.data.message || 'Gagal memperbarui siswa.');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal memperbarui siswa.');
        } finally {
            setIsModalVisible(false);
        }
    };

    const handleEditSiswa = (index) => {
        setIsModalVisible(true);
        setEditIndex(index);
        setFormData({
            fullname: students[index].fullname,
            nisn: students[index].nisn,
            classId: students[index].classId || '', // Pastikan kelas ada atau gunakan string kosong
            jenis_kelamin: students[index].jenis_kelamin,
        });
    };

    const handleDeleteSiswa = async (index) => {
        const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?');
        if (!confirmDelete) return;
    
        try {
            const studentToDelete = students[index];
            if (!studentToDelete || !studentToDelete.id) {
                console.error('ID pengguna tidak ditemukan untuk penghapusan.');
                return;
            }
    
            const token = localStorage.getItem('token');
            await axios.delete(`${SISWA_API_END_POINT}/${studentToDelete.id}`, { // Ganti USER_API_END_POINT dengan SISWA_API_END_POINT
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
    

    const filteredStudents = students.filter((student) =>
        student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nisn.includes(searchTerm) ||
        (student.kelas && student.kelas.toLowerCase().includes(searchTerm)) ||
        student.jenis_kelamin.toLowerCase().includes(searchTerm)
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className='bg-gray-200 min-h-screen p-6'>
        <h1 className="text-2xl font-bold mb-6">Data Siswa</h1>
        <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2 mb-4 transition duration-200"
            onClick={handleAddSiswa}
        >
            <IoPersonAddSharp />
            <span>Tambah Siswa</span>
        </button>
    
        <div className="flex justify-end mb-4">
            <input
                type="text"
                className="border border-gray-300 rounded py-2 px-4 text-sm w-64"
                placeholder="Cari siswa"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    
        <div className="overflow-x-auto mt-4 shadow-md rounded-lg">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead>
                    <tr className="bg-gray-100 text-left text-gray-800 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 border-b border-gray-300">No</th>
                        <th className="py-3 px-6 border-b border-gray-300">Nama</th>
                        <th className="py-3 px-6 border-b border-gray-300">NIS</th>
                        <th className="py-3 px-6 border-b border-gray-300">Kelas</th>
                        <th className="py-3 px-6 border-b border-gray-300">Jenis Kelamin</th>
                        <th className="py-3 px-6 border-b border-gray-300">Aksi</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                            <tr key={student.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-6 text-left">{index + 1}</td>
                                <td className="py-3 px-6 text-left">{student.fullname}</td>
                                <td className="py-3 px-6 text-left">{student.nisn}</td>
                                <td className="py-3 px-6 text-left">{student.Class?.kelas || 'Kelas tidak tersedia'}</td>
                                <td className="py-3 px-6 text-left">{student.jenis_kelamin}</td>
                                <td className="py-3 px-6 text-left">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded mr-2 transition duration-200"
                                        onClick={() => handleEditSiswa(index)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded transition duration-200"
                                        onClick={() => handleDeleteSiswa(index)}
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-4">Tidak ada data siswa</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    
        {isModalVisible && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                    <h2 className="text-lg font-bold mb-4">{editIndex === null ? 'Tambah Siswa' : 'Edit Siswa'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded py-2 px-3 w-full"
                                value={formData.fullname}
                                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">NISN</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded py-2 px-3 w-full"
                                value={formData.nisn}
                                onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Kelas</label>
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
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Jenis Kelamin</label>
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
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200"
                        >
                            {editIndex === null ? 'Tambah' : 'Simpan'}
                        </button>
                        <button
                            type="button"
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded ml-2 transition duration-200"
                            onClick={() => setIsModalVisible(false)}
                        >
                            Batal
                        </button>
                    </form>
                </div>
            </div>
        )}
    </div>
    
    );
}

export default Siswa;
