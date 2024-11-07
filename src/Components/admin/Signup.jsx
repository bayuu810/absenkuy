import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RadioGroup } from '@radix-ui/react-radio-group';
import { USER_API_END_POINT } from '../utils/constant.js';
import smk from "../../assets/smk.jpeg";
import { toast } from "sonner";
import axios from 'axios';
import { setLoading } from '../../redux/actions.js';

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        nis: "",
        email: "",
        password: "",
        role: "", // Initialize role as an empty string
    });

    const { loading } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput((prevInput) => ({
            ...prevInput,
            [name]: value,
        }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
    
        const data = {
            fullname: input.fullname,
            nis: input.nis,
            email: input.email,
            password: input.password,
            role: input.role,
        };
    
        console.log("Data to send:", data); // Log data
    
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, data, {
                headers: {
                    "Content-Type": "application/json", // Ubah ke JSON
                },
                withCredentials: true,
            });
    
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error.response); // Log complete error response
            toast.error(error.response?.data?.message || 'Terjadi kesalahan');
        } finally {
            dispatch(setLoading(false));
        }
    };
    
    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-200'>
            <div className='p-8 bg-white rounded-lg shadow-lg w-full max-w-md'>
                <h2 className='text-2xl font-bold mb-8 text-center text-blue-900'>
                    Aplikasi Absensi Online
                </h2>
                <img src={smk} alt="logo" className='w-[140px] mx-auto' />
                <form onSubmit={submitHandler} className='border border-gray-200 rounded-md p-4 my-10'>
                    <div className='mb-6'>
                        <label htmlFor="fullname" className='block text-blue-900 font-semibold mb-2'>
                            Nama Lengkap
                        </label>
                        <input
                            type='text'
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
                        <label htmlFor="nis" className='block text-blue-900 font-semibold mb-2'>
                            NIS
                        </label>
                        <input
                            type="text"
                            id='nis'
                            name='nis'
                            value={input.nis}
                            onChange={changeEventHandler}
                            placeholder='Masukan NIS'
                            className='w-full border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300'
                            required
                        />
                    </div>

                    <div className='mb-6'>
                        <label htmlFor="email" className='block text-blue-900 font-semibold mb-2'>
                            Email
                        </label>
                        <input
                            type="email"
                            id='email'
                            name='email'
                            value={input.email}
                            onChange={changeEventHandler}
                            placeholder='Masukan Email'
                            className='w-full border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300'
                            required
                        />
                    </div>

                    <div className='mb-6'>
                        <label htmlFor="password" className='block text-blue-900 font-semibold mb-2'>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Masukkan Password"
                            className="w-full border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            required
                            value={input.password}
                            onChange={changeEventHandler}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className='mb-6'>
                        <label className='block text-blue-900 font-semibold mb-2'>Role</label>
                        <RadioGroup className="flex items-center gap-4" value={input.role} onValueChange={(value) => setInput(prev => ({ ...prev, role: value }))}> 
                            <div className='flex items-center space-x-2'>
                                <input
                                    type="radio"
                                    id='role-admin'
                                    name='role'
                                    value="admin"
                                    checked={input.role === "admin"} // Check if role is admin
                                    onChange={changeEventHandler}
                                    className='cursor-pointer'
                                    required
                                />
                                <label htmlFor="role-admin">Admin</label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <input
                                    type="radio"
                                    id='role-siswa'
                                    name='role'
                                    value="siswa"
                                    checked={input.role === "siswa"} // Check if role is siswa
                                    onChange={changeEventHandler}
                                    className='cursor-pointer'
                                    required
                                />
                                <label htmlFor="role-siswa">Siswa</label>
                            </div>
                        </RadioGroup>
                    </div>

                    <button
                        type="submit"
                        className="w-full my-4 bg-blue-500 text-white rounded-lg py-2"
                        disabled={loading}
                    >
                        {loading ? "Silahkan Tunggu" : "Daftar"}
                    </button>

                    <span className='text-sm'>
                        Sudah Punya Akun?{" "}
                        <Link to="/" className='text-blue-600'>Masuk</Link>
                    </span>
                </form>
            </div>
        </div>
    );
};

export default Signup;
