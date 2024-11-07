import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Pastikan slice diimport dengan benar

const rootReducer = combineReducers({
  auth: authReducer, // Gabungkan semua reducer di sini
  // Tambahkan reducer lain jika ada
});

export default rootReducer;
