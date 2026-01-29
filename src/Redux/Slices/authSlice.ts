import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, AuthResponse } from "@/types/auth";

const STORAGE_KEY = "tulip_tea_auth";
const storedAuth = localStorage.getItem(STORAGE_KEY);
const authUser = storedAuth ? JSON.parse(storedAuth) : null;

const initialState: AuthState = {
  user: authUser?.user || null,
  token: authUser?.access_token || null,
  isAuthenticated: !!authUser?.access_token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      const { user, access_token } = action.payload;
      state.user = user;
      state.token = access_token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
