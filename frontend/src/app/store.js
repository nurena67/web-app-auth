import { configureStore } from "@reduxjs/toolkit";
import  authSlice from '../features/AuthSlice.js'

const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

export default store;
