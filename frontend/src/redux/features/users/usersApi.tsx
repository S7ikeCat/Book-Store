// src/redux/features/users/usersApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { IUser } from '../../../types/types';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Users'], // для автоматического обновления кэша
  endpoints: (builder) => ({
    getUsers: builder.query<IUser[], void>({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'], // обновляем кэш после удаления
    }),
    editUser: builder.mutation<IUser, { id: number; email: string; role_id: number }>({
        query: ({ id, email, role_id }) => ({
          url: `/users/${id}`,
          method: 'PUT',
          body: { email, role_id },
        }),
        invalidatesTags: ['Users'],
      }),
  }),
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useEditUserMutation,
} = usersApi;