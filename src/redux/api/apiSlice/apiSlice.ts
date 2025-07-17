import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithRath } from '../baseApi';

interface SliderResponse {
  id: string;
  image: string;
  title: string;
}

interface RecommendedResponse {
  products: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
  }>;
}

interface SimilarProductResponse {
  products: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
  }>;
}
export const api = createApi({
  reducerPath: 'api',
  keepUnusedDataFor: 0,
  baseQuery: baseQueryWithRath,
  tagTypes: ['Profile', 'Notifications', 'Products', 'Category'],
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Profile']
    }),
    login: builder.mutation({
      query: (data) => ({
        url: '/auth/login',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Profile']
    }),
    googlelogin: builder.mutation({
      query: (data) => ({
        url: '/auth/social-login',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Profile']
    }),
    forgetpass: builder.mutation({
      query: (data) => ({
        url: '/auth/forget-password',
        method: 'POST',
        body: data,
      }),
    }),
    otpVerify: builder.mutation({
      query: (data) => ({
        url: '/auth/otp-verification',
        method: 'POST',
        body: data,
      }),
    }),
    getHomeSlider: builder.query({
      query: () => ({
        url: '/slider', // Endpoint URL for the home slider
      }),
    }),

    getHomeRecommended: builder.query<RecommendedResponse, void>({
      query: () => ({
        url: '/home-page',
        params: { per_page: 10, type: 'recommended' },
      }),
      providesTags: ["Products", "Notifications"]
    }),

    getHomeProductDetailsSimilarProduct: builder.query<SimilarProductResponse, string>({
      query: (id) => ({
        url: '/similar-product',
        params: { per_page: 2, product_id: id },
      }),
      providesTags: ["Products"]
    }),

    // getHomeRecommendedCollection: builder.query({
    //   query: () => `/home-page?type=search&per_page=10&search=Lead Division Designer`
    // }),  

    getHomeRecommendedCollection: builder.query({
      query: ({ type = 'recommended', per_page = 10, page = 1, search = '' }) => ({
        url: `/home-page`,
        params: { type, per_page, page, search, }, // Adds query parameters properly
      }),
      providesTags: ["Products"]
    }),

    getHomeSellerCollection: builder.query({
      query: (args = {}) => {
        const { type = 'seller-collection', per_page = 10, page = 1, search = '' } = args;
        return {
          url: `/home-page`,
          params: { type, per_page, page, search },
        };
      },
      providesTags: ["Products"]
    }),
    getHomeProductDetails: builder.query({
      query: (id: string) => ({
        url: `/product-detail/${id}`, // Dynamic path parameter
      }),
      providesTags: ["Products"]
    }),
    getCategoryList: builder.query({
      query: () => ({
        url: `/category`
      })
    }),
    getAllCategoryList: builder.query({
      query: (id) => ({
        url: `/home-page?type=search&category_id=${id}`
      })
    }),
    getSubCategoryList: builder.query({
      query: (id) => ({
        url: `/home-page?sub_category_id=${id}&type=search`
      })
    }),
    getNotifications: builder.query({
      query: () => ({
        url: '/notifications',
      }),
      providesTags: ['Notifications']
    }),
    getOfferPirze: builder.query({
      query: (id) => ({
        url: `/asking-offer/?offer_id=${id}`,
      }),
      providesTags: ['Notifications']
    }),
    psotAcceptRejectOffer: builder.mutation<void, { id: number; type: 'accept' | 'reject' }>({
      query: ({ id, type }) => ({
        url: `/offer-accept-reject/${id}`,
        method: 'POST', // Use 'POST' or the actual method required by the API
        params: { type },
      }),
      invalidatesTags: ['Notifications']
    }),
    getAcceptOrReject: builder.query({
      query: (id) => ({
        url: `/offer-product-detail/${id}`,
      }),
      providesTags: ['Notifications']
    }),
    getMarkSingleNotifications: builder.query({
      query: (id) => ({
        url: `/mark-notification/${id}`,
      }),
      providesTags: ['Notifications']
    }),
    getMarkAllleNotifications: builder.query({
      query: () => ({
        url: '/mark-all-notification',
      }),
      providesTags: ['Notifications']
    }),
    getHomeSearch: builder.query({
      query: () => ({
        url: `home-page?per_page=20&type=search`
      })
    }),


    getProfile: builder.query({
      query: () => ({
        url: '/profile', // Endpoint URL
      }),
      providesTags: ['Profile'], // Tags for cache invalidation
    }),

    postEditProfile: builder.mutation({
      query: (data) => ({
        url: `/edit-profile`,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Profile']
    }),
    // postChangePassword: builder.mutation({
    //   query: (data) => ({
    //     url: `/change-password`,
    //     method: 'POST',
    //     body: data,
    //   }),
    //   invalidatesTags: ['Profile']
    // }),
    postChangePassword: builder.mutation({
      query: (data) => ({
        url: '/change-password',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Password changed successfully:', data);
        } catch (error) {
          console.log('Error:', error);
        }
      },
      transformResponse: (response) => {
        if (typeof response === 'string') {
          try {
            return JSON.parse(response);
          } catch {
            return response;
          }
        }
        return response;
      },
    }),
    postResetPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/reset-password',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Password reset successfully:', data);
        } catch (error) {
          console.log('Error:', error);
        }
      },
      transformResponse: (response) => {
        if (typeof response === 'string') {
          try {
            return JSON.parse(response);
          } catch {
            return response;
          }
        }
        return response;
      },
    }),
    // query: ({ type = 'recommended', per_page = 10, page = 1, search = '' }) => ({
    //   url: `/home-page`,
    //   params: { type, per_page, page, search, }, // Adds query parameters properly
    // }),
    // getwardrobeProductList: builder.query({
    //   query: () => ({
    //     url: 'product?per_page=100',
    // }),
    //   providesTags:['Products']
    // }),
    getwardrobeProductList: builder.query({
      query: ({ per_page = 100 }: { per_page?: number }) => ({
        url: `/product?per_page=${per_page}`,
      }),
      providesTags: ['Products'],
    }),

    getReviews: builder.query({
      query: () => ({
        url: '/rating', // Endpoint URL
      }),
    }),
    posUpdateProduct: builder.mutation({
      query: ({ formData, id }) => {
        console.log("asdfasdfasdf", id)
        return ({
          url: `/product/${id}`,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          method: 'POST',
          body: formData,
        })
      },
      invalidatesTags: ["Products"]
    }),
    postAddProduct: builder.mutation({
      query: (data) => ({
        url: '/product',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ["Products"]
    }),
     getValidationZipCode: builder.query({
      query: (zip) => ({
        url: `https://api.postcodes.io/postcodes/${zip}/validate`,
        method: 'GET',
      }),
    }),

    postBuyProduct: builder.mutation({
      query: (data) => ({
        url: '/buy-product-intent',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'POST',
        body: data,
      }),
    }),
    postBuyProductBackend: builder.mutation({
      query: (data) => ({
        url: '/payment',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'POST',
        body: data,
      }),
    }),
    // Make an offer
    postSendOffer: builder.mutation({
      query: (data) => ({
        url: '/asking-offer',
        headers: {
          'Content-Type': 'multipart/form-data'
        },

        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notifications']
    }),
    // Promotion
    postProductPromotionIntent: builder.mutation({
      query: (data) => ({
        url: '/product-promotion-intent',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'POST',
        body: data,
      }),
    }),
    postProductPromotionBackend: builder.mutation({
      query: (data) => ({
        url: '/product-promotion/71',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'POST',
        body: data,
      }),
    }),
    postDeleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
    // create connect
    postCreateConnect: builder.mutation({
      query: (email) => ({
        url: '/create-connected-account',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'POST',
        body: email,
      }),
      // invalidatesTags: ['Profile']
    }),

    // ====================Drawer EndPoint ===============

    getMyOrder: builder.query({
      query: () => ({
        url: '/order',
        params: { type: 'my_orders' }, // Use `params` for query parameters
      }),
      providesTags: ['Products'],
    }),
    getTrackParcel: builder.query({
      query: (id) => ({
        url: `/sendcloud/track-parcel/${id}`,
        params: { type: 'my_orders' }, // Use `params` for query parameters
      }),
      providesTags: ['Products'],
    }),
    getSellOrder: builder.query({
      query: () => ({
        url: '/order',
        params: { type: 'sell_orders' }, // Use `params` for query parameters
      }),
      providesTags: ['Products'],
    }),
    getMyOrderDetails: builder.query({
      query: (id) => ({
        url: `/order/${id}`,
        // params: { type: 'my_orders' }, // Use `params` for query parameters
      }),
      providesTags: ['Products'],
    }),
    getGenerateLabel: builder.query({
      query: (id) => ({
        url: `/sendcloud/generate-label/${id}`,
        // params: { type: 'my_orders' }, // Use `params` for query parameters
      }),
      providesTags: ['Products'],
    }),
    // getDownloadLabel: builder.query<ArrayBuffer, { order_id: number; parcel_id: number }>({
    //   query: ({ order_id, parcel_id }) => ({
    //     url: '/sendcloud/label-download',
    //     params: { order_id, parcel_id },
    //     responseHandler: (response) => response.arrayBuffer(), // 👈 tells fetch to treat as binary
    //     // optional: set responseType too
    //     responseType: 'arraybuffer',
    //   }),
    //   keepUnusedDataFor: 0, // remove data from store immediately
    //   // Optional: don't cache at all
    //   serializeQueryArgs: () => '',
    // }),

    getDownloadLabel: builder.query<string, { order_id: string; parcel_id: string }>({
      query: ({ order_id, parcel_id }) => ({
        url: '/sendcloud/label-download',
        params: { order_id, parcel_id },
        responseHandler: (response) => response.arrayBuffer(),
        responseType: 'arraybuffer',
      }),
      transformResponse: (arrayBuffer: ArrayBuffer) => {
        const uint8Array = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binary += String.fromCharCode(uint8Array[i]);
        }
        return `data:application/pdf;base64,${btoa(binary)}`;
      },
    }),




    // Ratings =============== ++++++++++++++ ===============
    postCreateRatings: builder.mutation({
      query: (data) => ({
        url: '/rating',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Profile']
    }),
    postHelpCenter: builder.mutation({
      query: (data) => ({
        url: '/help-center',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Profile']
    }),

    // postWishlist: builder.mutation({
    //   query: (data) => ({
    //     url: `/add-to-wishlist`,
    //     headers : {
    //       'Content-Type': 'multipart/form-data'
    //   },
    //     method: 'POST',
    //     body: data
    //   }),
    //   invalidatesTags: ['Products']
    // }),
    postWishlist: builder.mutation({
      query: (data) => ({
        url: `/add-to-wishlist`,
        headers: {
          'Content-Type': 'multipart/form-data', // Required for FormData
        },
        method: 'POST',
        body: data, // Use JSON.stringify for JSON body
      }),
      invalidatesTags: ['Products']
    }),

    getWishList: builder.query({
      query: () => ({
        url: `/get-wishlist?per_page=10`
      })
    }),
    getFaq: builder.query({
      query: () => ({
        url: `/faq`
      })
    }),
    getTermsAndCondition: builder.query({
      query: () => ({
        url: `/setting?type=Terms and Conditions`
      })
    }),
    getLegalNote: builder.query({
      query: () => ({
        url: `/setting?type=Legal Notes`
      })
    }),
    geOurtPlatForm: builder.query({
      query: () => ({
        url: `/setting?type=Our Platform`
      })
    }),
    postLogOut: builder.mutation({
      query: () => ({
        url: `/logout`,
        method: 'POST',
      }),
      invalidatesTags: ['Profile']
    }),
    getCheckConnect: builder.query<string, string>({
      query: (email) => ({
        url: `/check-connect/${email}`,

      }),
    }),
    checkToken: builder.mutation({
      query: (data) => ({
        url: `/auth/check-token`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Profile']
    }),
    getCheckToken: builder.query({
      query: (token) => ({
        url: `/auth/check-token?token=${token}`,
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useGoogleloginMutation,
  useGetProfileQuery,
  usePostEditProfileMutation,
  usePostChangePasswordMutation,
  useGetwardrobeProductListQuery,
  useGetReviewsQuery,
  useForgetpassMutation,
  useOtpVerifyMutation,
  useGetHomeSliderQuery,
  useGetHomeRecommendedQuery,
  useGetHomeSellerCollectionQuery,
  useGetHomeProductDetailsQuery,
  useGetHomeProductDetailsSimilarProductQuery,
  useGetHomeSearchQuery,
  useGetCategoryListQuery,
  useGetSubCategoryListQuery,
  usePostAddProductMutation,
  usePostBuyProductMutation,
  usePostBuyProductBackendMutation,
  usePostCreateConnectMutation,
  usePostProductPromotionIntentMutation,
  usePostProductPromotionBackendMutation,
  useGetMyOrderQuery,
  useGetSellOrderQuery,
  usePostLogOutMutation,
  usePostSendOfferMutation,
  usePostDeleteProductMutation,
  useGetHomeRecommendedCollectionQuery,
  useCheckTokenMutation,
  usePostWishlistMutation,
  useGetNotificationsQuery,
  useGetMarkSingleNotificationsQuery,
  useLazyGetMarkAllleNotificationsQuery,
  useGetOfferPirzeQuery,
  usePsotAcceptRejectOfferMutation,
  usePostCreateRatingsMutation,
  usePostResetPasswordMutation,
  usePostHelpCenterMutation,
  useGetMyOrderDetailsQuery,
  useGetAcceptOrRejectQuery,
  usePosUpdateProductMutation,
  useLazyGetCheckTokenQuery,
  useGetWishListQuery,
  useGetFaqQuery,
  useGetTermsAndConditionQuery,
  useGetLegalNoteQuery,
  useGeOurtPlatFormQuery,
  useGetCheckConnectQuery,
  useLazyGetGenerateLabelQuery,
  useLazyGetDownloadLabelQuery,
  useLazyGetTrackParcelQuery,
  useGetValidationZipCodeQuery,
  useLazyGetValidationZipCodeQuery
 } = api;
