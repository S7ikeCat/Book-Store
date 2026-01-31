import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';
import type { Book } from '../../../pages/home/TopSellers';

/* --------------------------
  Тип для одного товара в корзине
--------------------------- */
export interface CartItem {
  _id: number;
  title: string;
  newPrice: number;
  category: string;
  coverImage: string;
  quantity: number;
}

/* --------------------------
  Тип состояния корзины
  cartItems — массив товаров
--------------------------- */
interface CartState {
  cartItems: CartItem[];
}

/* --------------------------
  Начальное состояние корзины
--------------------------- */
const initialState: CartState = { cartItems: [] };

/* --------------------------
  Слайс Redux для корзины
  reducers:
    - addToCart: добавляет книгу или увеличивает quantity
    - removeFromCart: удаляет книгу полностью
    - clearCart: очищает корзину
    - decrementQuantity: уменьшает quantity или удаляет товар, если quantity = 1
--------------------------- */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {

    /* --------------------------
      Добавление книги в корзину
      Если книга уже есть — увеличиваем quantity
      И выводим SweetAlert уведомление
    --------------------------- */
    addToCart: (state, action: PayloadAction<Book>) => {
      const existing = state.cartItems.find(item => item._id === action.payload._id);

      if (existing) {
        existing.quantity += 1;

        Swal.fire({
          icon: 'info',
          title: 'Updated',
          text: `You now have ${existing.quantity} copies of "${existing.title}" in your cart.`,
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        state.cartItems.push({
          _id: action.payload._id,
          title: action.payload.title,
          newPrice: action.payload.newPrice,
          category: action.payload.category,
          coverImage: action.payload.coverImage,
          quantity: 1
        });

        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: `"${action.payload.title}" added to your cart.`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    },

    /* --------------------------
      Удаление книги из корзины по ID
    --------------------------- */
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cartItems = state.cartItems.filter(item => item._id !== action.payload);
    },

    /* --------------------------
      Очистка всей корзины
    --------------------------- */
    clearCart: (state) => {
      state.cartItems = [];
    },

    /* --------------------------
      Уменьшение количества книги
      Если quantity > 1 — уменьшаем
      Если quantity = 1 — удаляем товар
    --------------------------- */
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.cartItems.find(i => i._id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.cartItems = state.cartItems.filter(i => i._id !== action.payload);
        }
      }
    }

  }
});

/* --------------------------
  Экспорт actions и reducer
--------------------------- */
export const { addToCart, removeFromCart, clearCart, decrementQuantity } = cartSlice.actions;
export default cartSlice.reducer;
