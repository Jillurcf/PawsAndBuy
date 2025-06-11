// features/token/tokenSlice.js

import { createSlice } from '@reduxjs/toolkit';

const tokenSlice = createSlice({
  name: 'token',
  initialState: {
    token: null,
    role: null,
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    clearToken(state) {
      state.token = null;
    },
    setUserRole : (state, action) =>{
      state.role = action.payload;
    },
    clearUserRole(state) {
      state.role = null;
    },
  },
});

export const { setToken, clearToken,clearUserRole,setUserRole } = tokenSlice.actions;
export default tokenSlice.reducer;
