import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { OrderData } from '../../../types/ordersTypes';

export const ordersApi = createApi({
  tagTypes: ["Orders"] as const,
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getOrders: builder.query<OrderData[], void>({
      query: () => '/orders',
      providesTags: ['Orders'],
    }),
    
    getAllOrders: builder.query<OrderData[], void>({
      query: () => '/orders/admin', 
      providesTags: ['Orders'],
    }),
    cancelOrder: builder.mutation<void, number>({
      query: (id) => ({ url: `/orders/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Orders'],
    }),
  }),


});

export const { useGetOrdersQuery, useGetAllOrdersQuery, useCancelOrderMutation } = ordersApi;
