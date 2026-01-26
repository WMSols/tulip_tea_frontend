import { baseApi } from "@/Redux/Api/baseApi";
import {
  OrderBooker,
  CreateOrderBookerPayload,
  UpdateOrderBookerPayload,
} from "@/types/staff";

export const orderBookerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrderBooker: builder.mutation<
      OrderBooker,
      { distributor_id: number; body: CreateOrderBookerPayload }
    >({
      query: ({ distributor_id, body }) => ({
        url: `/order-bookers/${distributor_id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "OrderBooker", id: "LIST" }],
    }),

    getOrderBookersByDistributor: builder.query<
      OrderBooker[],
      { distributor_id: number }
    >({
      query: ({ distributor_id }) =>
        `/order-bookers/distributor/${distributor_id}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((x) => ({
                type: "OrderBooker" as const,
                id: x.id, // 🔥 number only
              })),
              { type: "OrderBooker" as const, id: "LIST" },
            ]
          : [{ type: "OrderBooker" as const, id: "LIST" }],
    }),

    updateOrderBooker: builder.mutation<OrderBooker, UpdateOrderBookerPayload>({
      query: ({ order_booker_id, ...body }) => ({
        url: `/order-bookers/${order_booker_id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (r, e, arg) => [
        { type: "OrderBooker", id: arg.order_booker_id }, // 🔥 number only
        { type: "OrderBooker", id: "LIST" },
      ],
    }),

    deleteOrderBooker: builder.mutation<
      { success: boolean },
      { order_booker_id: number }
    >({
      query: ({ order_booker_id }) => ({
        url: `/order-bookers/${order_booker_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (r, e, arg) => [
        { type: "OrderBooker", id: arg.order_booker_id },
        { type: "OrderBooker", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateOrderBookerMutation,
  useGetOrderBookersByDistributorQuery,
  useUpdateOrderBookerMutation,
  useDeleteOrderBookerMutation,
} = orderBookerApi;
