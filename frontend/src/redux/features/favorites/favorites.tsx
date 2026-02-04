import { createSlice  } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type { Book } from "../../../pages/home/TopSellers";

interface FavoritesState {
  items: Book[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<Book>) {
      const exists = state.items.find(
        (item) => item._id === action.payload._id
      );

      if (exists) {
        state.items = state.items.filter(
          (item) => item._id !== action.payload._id
        );
      } else {
        state.items.push(action.payload);
      }
    },
    removeFavorite(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item._id !== action.payload);
    }
  },
});

export const { toggleFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
