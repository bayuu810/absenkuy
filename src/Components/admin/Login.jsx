import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from 'axios';
import { setLoading } from '../../redux/actions.js';
import logo from "../../assets/logo.png.png"
import { USER_API_END_POINT } from '../utils/constant.js';

const Modal = ({ message, onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">Informasi</h3>
            <p>{message}</p>
            <button className="mt-4 w-full bg-blue-500 text-white rounded-lg py-2" onClick={onClose}>Tutup</button>
        </div>
    </div>
);

const Login = () => {
    const [input, setInput] = useState({ fullname: '', nisn: '', password: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const { loading } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput(prevInput => ({ ...prevInput, [name]: value }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
    
        // Validasi input
        if (!input.fullname || !input.nisn || !input.password) {
            setModalMessage('Fullname, NISN, dan Password harus disertakan');
            setIsModalOpen(true);
            return;
        }
    
        const data = { 
            fullname: input.fullname.trim(), 
            nisn: input.nisn.trim(), 
            password: input.password.trim() 
        };
    
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
    
            if (res.data.success) {
                toast.success(res.data.message);
                const token = res.data.data.token;
                if (token) {
                    localStorage.setItem('token', token);
                }
                console.log(res.data)
                const userRole = res.data.data.role;
                console.log(res.data.data.role)
                if (userRole) {
                    // Arahkan berdasarkan role
                    navigate(userRole === "admin" ? '/home' : '/home2');
                } else {
                    toast.error('User role not found.');
                }
    
                setModalMessage(res.data.message);
                setIsModalOpen(true);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error("Error:", error.response?.data);
            toast.error('Terjadi kesalahan: ' + (error.response?.data?.message || 'Error'));
        } finally {
            dispatch(setLoading(false));
        }
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-200'>
            <div className='p-8 bg-white rounded-lg shadow-lg w-full max-w-md'>
                <img src={logo} alt="logo" className='w-[190px] mx-auto' />
                <h2 className='text-2xl font-bold mb-8 text-center text-blue-900'>Absen Kuy</h2>
                <form onSubmit={submitHandler} className='border border-gray-200 rounded-md p-4 my-10'>
                    <div className='mb-6'>
                        <label htmlFor="fullname" className='block text-blue-900 font-semibold mb-2'>Nama Lengkap</label>
                        <input
                            type="text"
                            id='fullname'
                            name='fullname'
                            value={input.fullname}
                            onChange={changeEventHandler}
                            placeholder='Masukan Nama Lengkap'
                            className='w-full border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300'
                            required
                        />
                    </div>
                    <div className='mb-6'>
                        <label htmlFor="nisn" className='block text-blue-900 font-semibold mb-2'>NIS</label>
                        <input
                            type="text"
                            id='nisn'
                            name='nisn'
                            value={input.nisn}
                            onChange={changeEventHandler}
                            placeholder='Masukan NIS'
                            className='w-full border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300'
                            required
                        />
                    </div>
                    <div className='mb-6'>
                        <label htmlFor="password" className='block text-blue-900 font-semibold mb-2'>Password</label>
                        <input
                            type="password"
                            id='password'
                            name='password'
                            value={input.password}
                            onChange={changeEventHandler}
                            placeholder='Masukan Password'
                            className='w-full border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300'
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full my-4 bg-blue-500 text-white rounded-lg py-2"
                        disabled={loading}
                    >
                        {loading ? "Silahkan Tunggu" : "Masuk"}
                    </button>
                    <span className='text-sm'>
                        <h1>Belum Punya Akun?</h1>
                        <Link to="/Signup" className='text-blue-600'>
                            <span className='text-center'>Klik Link Disini!</span>
                        </Link>
                    </span>
                </form>
            </div>
            {isModalOpen && <Modal message={modalMessage} onClose={closeModal} />}
        </div>
    );
};

export default Login;
