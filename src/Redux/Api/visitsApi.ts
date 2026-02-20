import { baseApi } from "@/Redux/Api/baseApi";
import type {
  DailyCollectionDto,
  DeliveryDto,
  OrderDto,
  ShopVisitDto,
} from "@/types/visits";

export const fieldApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getShopVisitsAll: build.query<ShopVisitDto[], { limit?: number } | void>({
      query: (arg) => {
        const limit = arg && "limit" in arg ? (arg.limit ?? 1000) : 1000;
        return `shop-visits/all?limit=${limit}`;
      },
      providesTags: (result) =>
        result
          ? [
              { type: "ShopVisits" as const, id: "LIST" },
              ...result.map((v) => ({ type: "ShopVisits" as const, id: v.id })),
            ]
          : [{ type: "ShopVisits" as const, id: "LIST" }],
    }),

    getDeliveriesByDistributor: build.query<
      DeliveryDto[],
      { distributorId: number; limit?: number }
    >({
      query: ({ distributorId, limit = 1000 }) =>
        `deliveries/distributor/${distributorId}?limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              { type: "Deliveries" as const, id: "LIST" },
              ...result.map((d) => ({ type: "Deliveries" as const, id: d.id })),
            ]
          : [{ type: "Deliveries" as const, id: "LIST" }],
    }),

    getOrderById: build.query<OrderDto, { orderId: number }>({
      query: ({ orderId }) => `orders/${orderId}`,
      providesTags: (_result, _err, arg) => [
        { type: "Orders" as const, id: arg.orderId },
      ],
    }),

    getDailyCollectionById: build.query<
      DailyCollectionDto,
      { collectionId: number }
    >({
      query: ({ collectionId }) => `daily-collections/${collectionId}`,
      providesTags: (_result, _err, arg) => [
        { type: "DailyCollections" as const, id: arg.collectionId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetShopVisitsAllQuery,
  useGetDeliveriesByDistributorQuery,
  useLazyGetOrderByIdQuery,
  useLazyGetDailyCollectionByIdQuery,
} = fieldApi;
