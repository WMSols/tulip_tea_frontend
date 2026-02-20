import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  /** True while header refresh button has triggered a refetch (show page skeleton) */
  headerRefreshing: boolean;
}

const initialState: UiState = {
  headerRefreshing: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setHeaderRefreshing: (state, action: { payload: boolean }) => {
      state.headerRefreshing = action.payload;
    },
  },
});

export const { setHeaderRefreshing } = uiSlice.actions;
export default uiSlice.reducer;
