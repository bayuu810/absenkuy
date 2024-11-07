// src/Components/ProfilePage.js

import React, { useState, useEffect } from 'react';
import reza from "../../assets/reza.jpeg"; // Pastikan jalur ini benar

const ProfilePage = () => {
    const [name, setName] = useState(() => localStorage.getItem('name') || 'Reza');
    const [email, setEmail] = useState(() => localStorage.getItem('email') || 'rezaaditya@gmail.com');
    const [avatar, setAvatar] = useState(reza); 
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        localStorage.setItem('name', name);
        localStorage.setItem('email', email);
    }, [name, email]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result); // Set avatar dengan data URL gambar
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Password baru dan konfirmasi password tidak cocok.");
            return;
        }
        console.log('Ganti Password:', newPassword);
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        setIsEditing(false);
        console.log('Perubahan Profil:', { name, email });
    };

    const handleDeleteAccount = () => {
        const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus akun ini?');
        if (confirmDelete) {
            console.log('Akun dihapus');
            localStorage.removeItem('name');
            localStorage.removeItem('email');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 border border-gray-200 rounded-lg shadow-xl bg-white">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Profil Pengguna</h2>

            <div className="flex items-center mb-6 bg-gray-100 p-4 rounded-lg shadow-md">
                <img 
                    src={avatar} 
                    alt="Avatar" 
                    className="w-36 h-36 rounded-full border-4 border-blue-600 mr-4 shadow-lg transition-transform duration-200 transform hover:scale-110" 
                />
                <div className="flex flex-col flex-grow">
                    {isEditing ? (
                        <form onSubmit={handleProfileSubmit} className="flex flex-col">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full mb-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                placeholder="Nama"
                                required
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mb-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                placeholder="Email"
                                required
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="mb-4 p-2 border border-gray-300 rounded-lg"
                            />
                            <button
                                type="submit"
                                className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
                            >
                                Simpan
                            </button>
                        </form>
                    ) : (
                        <>
                            <h3 className="text-2xl font-semibold text-gray-800">{name}</h3>
                            <p className="text-gray-600">{email}</p>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-2 py-1 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                Edit Profil
                            </button>
                        </>
                    )}
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ganti Sandi</h2>
            <form onSubmit={handlePasswordSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block mb-2 text-gray-700" htmlFor="oldPassword">Sandi Lama:</label>
                    <input
                        id="oldPassword"
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-gray-700" htmlFor="newPassword">Sandi Baru:</label>
                    <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-gray-700" htmlFor="confirmPassword">Konfirmasi Sandi Baru:</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
                >
                    Ganti Sandi
                </button>
            </form>

            <footer className="mt-6 text-center">
                <p className="text-gray-600">© 2024 Aplikasi Absensi Online SMKN 3 BANJAR. Semua Hak Dilindungi.</p>
            </footer>
        </div>
    );
};

export default ProfilePage;
