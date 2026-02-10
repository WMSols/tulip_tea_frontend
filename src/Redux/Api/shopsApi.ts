import { baseApi } from "@/Redux/Api/baseApi";
import { ApiShop, VerifyShopRequest, ReassignShopRequest } from "@/types/shops";

export const shopsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllShops: builder.query<ApiShop[], number>({
      query: (distributorId) => `/shops/all?distributor_id=${distributorId}`,
      providesTags: ["Shops"],
    }),

    getPendingShops: builder.query<ApiShop[], void>({
      query: () => "/shops/pending",
      providesTags: ["Shops"],
    }),

    verifyShop: builder.mutation<
      ApiShop,
      { shop_id: number; distributor_id: number; body: VerifyShopRequest }
    >({
      query: ({ shop_id, distributor_id, body }) => ({
        url: `/shops/${shop_id}/verify?distributor_id=${distributor_id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Shops"],
    }),

    reassignShop: builder.mutation<ApiShop, ReassignShopRequest>({
      query: ({ shop_id, new_order_booker_id }) => ({
        url: `/shops/${shop_id}/reassign?new_order_booker_id=${new_order_booker_id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Shops"],
    }),
  }),
});

export const {
  useGetAllShopsQuery,
  useGetPendingShopsQuery,
  useVerifyShopMutation,
  useReassignShopMutation,
} = shopsApi;
