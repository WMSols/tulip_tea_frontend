import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, AuthResponse } from "@/types/auth";

const storedAuth = localStorage.getItem("tulip_tea_auth");
const authUser = storedAuth ? JSON.parse(storedAuth) : null;

const initialState: AuthState = {
  user: authUser?.user || null,
  token: authUser?.token || null,
  isAuthenticated: !!authUser?.token,
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
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
