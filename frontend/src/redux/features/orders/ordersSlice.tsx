import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";
import type { OrderData } from "../../../types/ordersTypes";

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/orders`,
    credentials: 'include',
  }),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderData, OrderData>({
      query: (newOrder) => ({
        url: "/",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ['Orders'],
    }),
    getOrderByEmail: builder.query<OrderData[], string>({
      query: (email) => `/${email}`,
      providesTags: ['Orders'],
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrderByEmailQuery } = ordersApi;
