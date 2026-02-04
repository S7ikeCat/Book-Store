import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { OrderData } from '../../../types/ordersTypes';

export const ordersApi = createApi({
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
      query: () => '/orders', // email теперь не нужен, сервер берёт из токена
    }),
  }),
});

export const { useGetOrdersQuery } = ordersApi;
