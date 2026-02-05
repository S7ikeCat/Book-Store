import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../redux/features/cart/cartSlice'
import favoritesReducer from '../redux/features/favorites/favorites'
import authReducer from './features/auth/authSlice'
import { ordersApi } from './features/orders/ordersSlice' // 👈 здесь мы импортируем named export, а не default
import { usersApi } from './features/users/usersApi';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    favorites: favoritesReducer,
    auth: authReducer,
    // Подключаем RTK Query reducer под ключ ordersApi.reducerPath
    [ordersApi.reducerPath]: ordersApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ordersApi.middleware, usersApi.middleware),
});

// Типы для useSelector и dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
