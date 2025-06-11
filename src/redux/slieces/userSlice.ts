// features/token/tokenSlice.js

import {createSlice} from '@reduxjs/toolkit';

const tokenSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const {setUser, clearUser} = tokenSlice.actions;
export default tokenSlice.reducer;
