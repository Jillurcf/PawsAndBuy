// import { configureStore } from '@reduxjs/toolkit';
// import { apiSlice } from './api/apiSlice/apiSlice';
// // import { anotherApiSlice } from './anotherApiSlice';
// import authReducer from './api/authSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     [apiSlice.reducerPath]: apiSlice.reducer,
//     // [anotherApiSlice.reducerPath]: anotherApiSlice.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware()
//       .concat(apiSlice.middleware)
//       // .concat(anotherApiSlice.middleware),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import {api} from './api/apiSlice/apiSlice';
import {configureStore} from '@reduxjs/toolkit';
import extraReducer from './slieces/extraSlices';
import tokenReducer from './slieces/tokenSlice';
import userReducer from './slieces/userSlice';

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    token: tokenReducer,
    extra: extraReducer,
    user: userReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
