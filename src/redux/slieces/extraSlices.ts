// features/token/tokenSlice.js

import {createSlice} from '@reduxjs/toolkit';

const extraSlice = createSlice({
  name: 'extra',
  initialState: {
    lovePrice: 1,
    transactionsFee: 3,
  },
  reducers: {
    setPrice(state, action) {
      state.lovePrice = action.payload;
    },
    setTransactionsFee(state, action) {
      state.transactionsFee = action.payload;
    },
  },
});

export const {setPrice, setTransactionsFee} = extraSlice.actions;
export default extraSlice.reducer;
