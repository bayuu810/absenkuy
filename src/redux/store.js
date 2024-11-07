import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer'; // Pastikan reducer diimport dengan benar

const store = configureStore({
  reducer: rootReducer,
});

export default store;
