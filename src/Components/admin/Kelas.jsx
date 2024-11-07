import React, { useState, useEffect } from 'react';
import { FaPlusCircle } from "react-icons/fa";
import axios from 'axios';
import { toast } from 'sonner';
import { KELAS_API_END_POINT } from '../utils/constant';

const Kelas = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [formData, setFormData] = useState({ angkatan: '', kelas: '' });
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Jumlah item per halaman

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchKelasData = async () => {
            try {
                const response = await axios.get(`${KELAS_API_END_POINT}/list`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setStudents(response.data.classes);
                } else {
                    toast.error('Gagal mengambil data kelas.');
                }
            } catch (error) {
                console.error(error);
                toast.error('Terjadi kesalahan saat mengambil data kelas.');
            }
        };

        fetchKelasData();
    }, [token]);

    const handleAddKelas = () => {
        setIsModalVisible(true);
        setEditIndex(null);
        setFormData({ angkatan: '', kelas: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editIndex === null) {
            await handleAddNewKelas();
        } else {
            await handleUpdateKelas();
        }
    };

    const handleAddNewKelas = async () => {
        try {
            const response = await axios.post(`${KELAS_API_END_POINT}/create`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setStudents((prev) => [...prev, response.data.kelas]);
                setShowConfirmation(true);
            } else {
                toast.error('Gagal menambahkan kelas.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Terjadi kesalahan saat menambahkan kelas.');
        } finally {
            setIsModalVisible(false);
        }
    };

    const handleUpdateKelas = async () => {
        try {
            const response = await axios.put(`${KELAS_API_END_POINT}/${students[editIndex].id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setStudents((prev) =>
                    prev.map((student, index) =>
                        index === editIndex ? { ...student, ...formData } : student
                    )
                );
                toast.success('Kelas berhasil diperbarui!');
            } else {
                toast.error('Gagal memperbarui kelas.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Gagal memperbarui kelas.');
        } finally {
            setIsModalVisible(false);
        }
    };

    const handleEditKelas = (index) => {
        setIsModalVisible(true);
        setEditIndex(index);
        setFormData({ angkatan: students[index].angkatan, kelas: students[index].kelas });
    };

    const handleDeleteKelas = async (index) => {
        const studentId = students[index].id;

        try {
            const response = await axios.delete(`${KELAS_API_END_POINT}/${studentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setStudents((prev) => prev.filter((_, i) => i !== index));
                toast.success('Kelas berhasil dihapus!');
            } else {
                toast.error('Gagal menghapus kelas.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Gagal menghapus kelas.');
        }
    };

    const filteredStudents = (students || []).filter((student) => {
        const angkatanMatch = student?.angkatan?.toLowerCase().includes(searchTerm.toLowerCase());
        const kelasMatch = student?.kelas?.toLowerCase().includes(searchTerm.toLowerCase());
        return angkatanMatch || kelasMatch;
    });

    // Pagination logic
    const indexOfLastStudent = currentPage * itemsPerPage; // Indeks terakhir siswa di halaman saat ini
    const indexOfFirstStudent = indexOfLastStudent - itemsPerPage; // Indeks pertama siswa di halaman saat ini
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent); // Ambil siswa yang ditampilkan di halaman saat ini
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage); // Total halaman berdasarkan jumlah siswa yang difilter

    return (
        <div className='bg-gray-200 min-h-screen p-6'>
            <div className="flex flex-col space-y-2">
                <h1 className="text-2xl font-bold">Data Kelas</h1>
                <span className="text-gray-600">Home / Data Kelas</span>
            </div>

            <div className="flex space-x-4 my-4">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
                    onClick={handleAddKelas}
                >
                    <FaPlusCircle />
                    <span>Tambah Kelas</span>
                </button>
            </div>

            <div className="flex justify-end">
                <div className='min-w-[300px]'>
                    <span className='font-semibold text-gray-400 mr-1'>SEARCH :</span>
                    <input
                        type="text"
                        className="border border-gray-300 rounded py-1 px-2 text-sm mr-4"
                        placeholder="Cari Angkatan atau Kelas"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto mt-4">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr className="w-full bg-gray-200 text-left text-black uppercase text-sm leading-normal">
                            <th className="bg-white py-3 px-6 border-b border-gray-300">No</th>
                            <th className="bg-white py-3 px-6 border-b border-gray-300">Angkatan</th>
                            <th className="bg-white py-3 px-6 border-b border-gray-300">Kelas</th>
                            <th className="bg-white py-3 px-6 border-b border-gray-300 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {currentStudents.length > 0 ? (
                            currentStudents.map((student, index) => (
                                <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left">{indexOfFirstStudent + index + 1}</td>
                                    <td className="py-3 px-6 text-left">{student.angkatan}</td>
                                    <td className="py-3 px-6 text-left">{student.kelas}</td>
                                    <td className="py-3 px-6 text-left">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                className="bg-blue-500 text-white text-sm py-1 px-2 rounded w-24"
                                                onClick={() => handleEditKelas(indexOfFirstStudent + index)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white text-sm py-1 px-2 rounded w-24"
                                                onClick={() => handleDeleteKelas(indexOfFirstStudent + index)}
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-3 px-6 text-center">Tidak ada data yang cocok.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600">
                    Menampilkan {indexOfFirstStudent + 1} - {Math.min(indexOfLastStudent, filteredStudents.length)} dari {filteredStudents.length} data kelas
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
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-[400px]">
                        <h2 className="text-xl font-bold mb-4">
                            {editIndex === null ? 'Tambah Kelas' : 'Edit Kelas'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Angkatan</label>
                                <select 
                                    value={formData.angkatan}
                                    onChange={(e) => setFormData({ ...formData, angkatan: e.target.value })}
                                    className="border rounded w-full py-2 px-3"
                                    required
                                >
                                    <option value="">Pilih Angkatan</option>
                                    <option value="X">X</option>
                                    <option value="XI">XI</option>
                                    <option value="XII">XII</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Kelas</label>
                                <input
                                    type="text"
                                    value={formData.kelas}
                                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                                    className="border rounded w-full py-2 px-3"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white py-2 px-4 rounded"
                                    onClick={() => setIsModalVisible(false)}
                                >
                                    Batal
                                </button>
                                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                                    {editIndex === null ? 'Tambah' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showConfirmation && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] flex flex-col items-center">
                        <div className="flex items-center mb-4">
                            <svg
                                className="w-12 h-12 text-green-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-center">Data Berhasil Ditambahkan!</h2>
                        <p className="text-gray-600 mb-4 text-center">
                            Kelas baru telah berhasil ditambahkan ke dalam daftar kelas.
                        </p>
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
                            onClick={() => setShowConfirmation(false)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Kelas;
 