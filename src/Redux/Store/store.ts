import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/Redux/Slices/authSlice";
import uiReducer from "@/Redux/Slices/uiSlice";
import { baseApi } from "@/Redux/Api/baseApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
