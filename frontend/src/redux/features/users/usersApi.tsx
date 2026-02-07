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
    // Получение всех пользователей
    getUsers: builder.query<IUser[], void>({
      query: () => '/users',
      providesTags: ['Users'],
    }),

    // Удаление пользователя
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'], // обновляем кэш после удаления
    }),

    // Редактирование пользователя (email + роль)
    editUser: builder.mutation<IUser, { id: number; email: string; role_id: number }>({
      query: ({ id, email, role_id }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: { email, role_id },
      }),
      invalidatesTags: ['Users'], // обновляем кэш после изменения
    }),
  }),
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useEditUserMutation,
} = usersApi;