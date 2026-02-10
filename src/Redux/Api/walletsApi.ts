import { baseApi } from "@/Redux/Api/baseApi";
import {
  WalletBalance,
  TeamWallet,
  WalletTransaction,
  CollectRequest,
} from "@/types/wallet";

export const walletsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDistributorBalance: builder.query<WalletBalance, number>({
      query: (distributorId) =>
        `/wallets/distributor/${distributorId}/balance`,
      providesTags: ["WalletBalance"],
    }),

    getAllWallets: builder.query<TeamWallet[], number>({
      query: (distributorId) =>
        `/wallets/distributor/${distributorId}/all-wallets`,
      providesTags: ["Wallets"],
    }),

    getWalletTransactions: builder.query<
      WalletTransaction[],
      { distributorId: number; limit?: number }
    >({
      query: ({ distributorId, limit = 50 }) =>
        `/wallets/distributor/${distributorId}/transactions?limit=${limit}`,
      providesTags: ["WalletTransactions"],
    }),

    collectFromWallet: builder.mutation<
      WalletTransaction,
      { distributorId: number; body: CollectRequest }
    >({
      query: ({ distributorId, body }) => ({
        url: `/wallets/distributor/${distributorId}/collect`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["WalletBalance", "Wallets", "WalletTransactions"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDistributorBalanceQuery,
  useGetAllWalletsQuery,
  useGetWalletTransactionsQuery,
  useCollectFromWalletMutation,
} = walletsApi;
