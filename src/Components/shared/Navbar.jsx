import React from "react";
import { FaBars, FaSearch, FaBell } from "react-icons/fa";
import logo from "../../assets/logo.png.png"
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "../utils/constant";
import { toast } from "sonner";
import axios from "axios";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token tidak ditemukan, silakan login kembali.");
        return;
      }

      const res = await axios.post(
        `${USER_API_END_POINT}/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        localStorage.removeItem("token");
        toast.success(res.data.message || "Logout berhasil!");
        navigate("/");
      } else {
        toast.error(res.data.message || "Logout gagal, silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error(error.response?.data?.message || "Logout gagal, terjadi kesalahan pada server.");
    }
  };

  return (
    <nav className='bg-[#4761d8] px-4 py-3 fixed top-0 left-0 w-full z-10'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center text-xl'>
          <img src={logo} alt="logo" className="w-[40px] mx-auto mr-3" />
          <span className='text-white font-bold'>Absen Kuy</span>
        </div>
        <div className='flex items-center gap-4'>
          <div className='relative md:w-64'>
            <span className='absolute inset-y-0 left-0 flex items-center pl-2'>
              <FaSearch className='w-5 h-5 text-black' />
            </span>
            <input
              type='text'
              className='w-full px-4 py-2 pl-10 rounded shadow outline-none hidden md:block'
              placeholder='Search'
            />
          </div>
        </div>
        <div className='flex items-center gap-x-4'>
          <FaBell className='text-white w-6 h-6 cursor-pointer' />
          <div className='relative'>
            <div className='text-white group cursor-pointer'>
              <img src={logo} alt="profile" className="w-[30px] h-[30px] mx-auto rounded-full object-cover" />
              <div className='absolute hidden group-hover:block z-10 rounded-lg shadow w-32 top-full right-0 bg-white'>
                <ul className='py-2 text-sm text-gray-950'>
                  <li>
                    <Link to='/Profile' className='block px-3 py-2 hover:bg-blue-400'>Profile</Link>
                  </li>
                  <li>
                    <a onClick={logoutHandler} className='block px-3 py-2 hover:bg-blue-400 cursor-pointer'>Log Out</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
