// import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const baseQuery = fetchBaseQuery({
//   baseUrl: 'http://182.252.68.227:8001/api',
//   prepareHeaders: async (headers) => {
//     const token = await AsyncStorage.getItem('token');
//     const user = await AsyncStorage.getItem('user');
//     console.log("baseApi 8", token);
//     console.log("baseApi 10", user);
//     if (token) {
//       headers.set('Authorization', `Bearer ${token}`);
//       headers.set('Accept', 'application/json')
//     }
//     return headers;
//   },

//   responseHandler: async (response) => {
//     const text = await response.text();
//     try {
//       return JSON.parse(text);
//     } catch (err) {
//       return text; // Fallback for non-JSON responses
//     }
//   },
// });


import {BaseQueryFn, createApi} from '@reduxjs/toolkit/query/react';
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

import {getStorageToken} from '../../utils/Utils';

interface BaseQueryArgs extends AxiosRequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

// Type for the args that will be passed to axios (base query arguments)
const cache = new Map();

export const baseQueryWithRath: BaseQueryFn<BaseQueryArgs, unknown, unknown> = async (
  args,
  api,
  extraOptions,
) => {
  // const cacheKey = `${args.method}-${args.url}-${JSON.stringify(args.body)}`;
  
  // // Check the cache
  // if (cache.has(cacheKey)) {
  //   return { data: cache.get(cacheKey) };
  // }

  try {
    const token = getStorageToken();
    const result: AxiosResponse = await axios({
      // baseURL: 'http://192.168.12.140:8000/api',
      baseURL: 'http://182.252.68.227:8001/api',
      ...args,
      url: args.url,
      method: args.method,
      data: args.body,
      headers: {
        ...args.headers,
        Authorization: token ? `Bearer ${token}` : '',
        Accept: token ? `application/json` : '',
      },
    });

    // console.log(result.data);
    // Check if response data is a string and malformed
    if (typeof result?.data === 'string') {
      // if (!result.data.endsWith('}')) {
      const withCurly = (result.data += '}');
      return {data: JSON.parse(withCurly)};
      // }
    }
    if (typeof result?.data === 'object') {
      return {data: result?.data};
    }

    return {data: result?.data};
  } catch (error: any) {
    if (error.response?.data) {
      if (typeof error.response?.data === 'string') {
        const withCurly = (error.response.data += '}');

        return {error: JSON.parse(withCurly)};
      } else {
        return {error: error.response?.data};
      }
    }
    return {
      error: {
        status: error.response?.status || 500,
        data: error.message || 'Something went wrong',
      },
    };
  }
};

// export const api = createApi({
//   reducerPath: 'api',
//   baseQuery: baseQueryWithRath,
//   tagTypes: ['Profile', 'Notifications', 'Products', 'Category'],
//   endpoints: (builder) => ({
//     signup: builder.mutation({
//       query: (data) => ({
//         url: '/auth/register',
//         method: 'POST',
//         body: data,
//       }),
//       invalidatesTags: ['Profile']
//     }),
//     login: builder.mutation({
//       query: (data) => ({
//         url: '/auth/login',
//         method: 'POST',
//         body: data,
//       }),
//       invalidatesTags: ['Profile']
//     }),
//     googlelogin: builder.mutation({
//       query: (data) => ({
//         url: '/auth/social-login',
//         method: 'POST',
//         body: data,
//       }),
//       invalidatesTags: ['Profile']
//     }),
//     forgetpass: builder.mutation({
//       query: (data) => ({
//         url: '/auth/forget-password',
//         method: 'POST',
//         body: data,
//       }),
//     }),
//     otpVerify: builder.mutation({
//       query: (data) => ({
//         url: '/auth/otp-verification',
//         method: 'POST',
//         body: data,
//       }),
//     }),
//     getHomeSlider: builder.query({
//       query: () => '/slider',
//     }),
    
//     getHomeRecommended: builder.query({
//       query: () => '/home-page?per_page=10&type=recommended'
//     }),

//     getHomeProductDetailsSimilarProduct: builder.query({
//       query: (id) => `/similar-product?per_page=2&product_id=${id}`,
//     }),

//     // getHomeRecommendedCollection: builder.query({
//     //   query: () => `/home-page?type=search&per_page=10&search=Lead Division Designer`
//     // }),  

//     getHomeRecommendedCollection: builder.query({
//       query: ({ type = 'search', per_page = 10, page = 1, search = '' }) => 
//         `/home-page?type=${type}&per_page=${per_page}&page=${page}&search=${search}`,
//     }),
    
//     getHomeSellerCollection: builder.query({
//       query: () => `/home-page?per_page=20&type=seller-collection`
//     }),  
//     getHomeProductDetails: builder.query({
//       query: (id) => `/product-detail/${id}`,
//     }),
//     getCategoryList: builder.query({
//       query: () => `/category`
//     }),
//     getAllCategoryList: builder.query({
//       query: (id) => `/home-page?type=search&category_id=${id}`
//     }),
//     getNotifications: builder.query({
//       query: () =>({
//         url: '/notifications',
//       })
//     }),
//     getHomeSearch: builder.query({
//       query: () => `home-page?per_page=20&type=search`
//     }),
//     getProfile: builder.query({
//       query: () => '/profile',
//       providesTags: ['Profile'],
//     }),
//     postEditProfile: builder.mutation({
//       query: (data) => ({
//         url: `/edit-profile`,
//         method: 'POST',
//         body: data,
//       }),
//       invalidatesTags: ['Profile']
//     }),
//     // postChangePassword: builder.mutation({
//     //   query: (data) => ({
//     //     url: `/change-password`,
//     //     method: 'POST',
//     //     body: data,
//     //   }),
//     //   invalidatesTags: ['Profile']
//     // }),
//     postChangePassword: builder.mutation({
//       query: (data) => ({
//         url: '/change-password',
//         method: 'POST',
//         body: data,
//       }),
//       async onQueryStarted(arg, { queryFulfilled }) {
//         try {
//           const { data } = await queryFulfilled;
//           console.log('Password changed successfully:', data);
//         } catch (error) {
//           console.log('Error:', error);
//         }
//       },
//       transformResponse: (response) => {
//         if (typeof response === 'string') {
//           try {
//             return JSON.parse(response);
//           } catch {
//             return response;
//           }
//         }
//         return response;
//       },
//     }),
    
//     getwardrobeProductList: builder.query({
//       query: () => '/product?per_page=10',
//       providesTags: ['Products'],
//     }),
//     getReviews: builder.query({
//       query: () => '/rating',
//       providesTags: ['Products'],
//     }),
//     postAddProduct: builder.mutation({
//       query: (data) => ({
//         url: '/product',
//         method: 'POST',
//         body: data,
//       }),
//       invalidatesTags: ["Products"]
//     }),
//     postBuyProduct: builder.mutation({
//       query: (data) => ({
//         url: '/buy-product-intent',
//         headers : {
//             'Content-Type': 'multipart/form-data'
//         },
//         method: 'POST',
//         body: data,
//       }),
//     }),
//     postBuyProductBackend: builder.mutation({
//       query: (data) => ({
//         url: '/payment',
//         headers : {
//             'Content-Type': 'multipart/form-data'
//         },
//         method: 'POST',
//         body: data,
//       }),
//     }),
//     // Make an offer
//     postSendOffer: builder.mutation({
//       query: (data) => ({
//         url: '/asking-offer',
//         headers : {
//             'Content-Type': 'multipart/form-data'
//         },
//         method: 'POST',
//         body: data,
//       }),
//     }),
//     // Promotion
//     postProductPromotionIntent: builder.mutation({
//       query: (data) => ({
//         url: '/product-promotion-intent',
//         headers : {
//             'Content-Type': 'multipart/form-data'
//         },
//         method: 'POST',
//         body: data,
//       }),
//     }),
//     postProductPromotionBackend: builder.mutation({
//       query: (data) => ({
//         url: '/product-promotion/71',
//         headers : {
//             'Content-Type': 'multipart/form-data'
//         },
//         method: 'POST',
//         body: data,
//       }),
//     }),
//     postDeleteProduct: builder.mutation({
//       query: (id) => ({
//         url: `/product/${id}`,
//         method: 'DELETE',
//        }),
//       invalidatesTags: ['Products'],
//     }),
//     // create connect
//     postCreateConnect: builder.mutation({
//       query: (email) => ({
//         url: '/create-connected-account',
//         headers : {
//             'Content-Type': 'multipart/form-data'
//         },
//         method: 'POST',
//         body: email,
//       }),
//     }),
//     getMyOrder: builder.query({
//       query: () => '/order?type=my_orders',
//       providesTags: ['Products'],
//     }),
//     getSellOrder: builder.query({
//       query: () => '/order?type=sell_orders',
//       providesTags: ['Products'],
//     }),
//     postLogOut: builder.mutation({
//       query: () => ({
//         url: `/logout`,
//         method: 'POST',
//       }),
//       invalidatesTags: ['Profile']
//     }),
//     checkToken: builder.mutation({
//       query: (data) => ({
//         url: `/auth/check-token`,
//         method: 'POST',
//         body: data
//       }),
//       invalidatesTags: ['Profile']
//     }),
//   }),
  
// });

// export const { 
//   useSignupMutation,
//   useLoginMutation, 
//   useGoogleloginMutation,
//   useGetProfileQuery,
// usePostEditProfileMutation,
// usePostChangePasswordMutation,
//   useGetwardrobeProductListQuery,
// useGetReviewsQuery,
//   useForgetpassMutation,
//   useOtpVerifyMutation,
//   useGetHomeSliderQuery,
//   useGetHomeRecommendedQuery, 
//   useGetHomeSellerCollectionQuery,
//   useGetHomeProductDetailsQuery,                                         
//   useGetHomeProductDetailsSimilarProductQuery,                                           
//   useGetHomeSearchQuery,
//   useGetCategoryListQuery,
//   usePostAddProductMutation,
//   usePostBuyProductMutation,
//   usePostBuyProductBackendMutation,
//   usePostCreateConnectMutation,
//   usePostProductPromotionIntentMutation,
//   usePostProductPromotionBackendMutation,
//   useGetMyOrderQuery,
//   useGetSellOrderQuery,
//   usePostLogOutMutation,
//   usePostSendOfferMutation,
//   usePostDeleteProductMutation,
//   useGetHomeRecommendedCollectionQuery,
//   useCheckTokenMutation,
//   useGetNotificationsQuery,
//  } = api;

export const imageUrl = "http://182.252.68.227:8001"