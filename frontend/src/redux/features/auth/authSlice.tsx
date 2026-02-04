import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  currentUser: { id: number; email: string; role: string } | null;
  token: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState, // <--- вот здесь мы его используем
  reducers: {
    setUser: (state, action: PayloadAction<{ id: number; email: string; role: string }>) => {
      state.currentUser = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
    },
  },
});

export const { setUser, setToken, logout } = authSlice.actions;
export default authSlice.reducer;