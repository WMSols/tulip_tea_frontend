import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "@/Redux/Store/store";
import { logout } from "@/Redux/Slices/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    headers.set("content-type", "application/json");
    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    api.dispatch(logout());
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "Zones",
    "Routes",
    "OrderBooker",
    "DeliveryMan",
    "Shops",
    "CreditLimitRequests",
    "Products",
    "Warehouses",
    "WarehouseInventory",
    "WarehouseDeliveryMen",
    "ShopVisits",
    "Deliveries",
    "Orders",
    "Wallets",
    "WalletBalance",
    "WalletTransactions",
  ],
  endpoints: () => ({}),
});
