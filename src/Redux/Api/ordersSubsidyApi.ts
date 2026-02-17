import { baseApi } from "@/Redux/Api/baseApi";
import type {
  PendingSubsidyOrderDto,
  RejectSubsidyRequest,
} from "@/types/subsidy";

export const ordersSubsidyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPendingSubsidyApproval: build.query<PendingSubsidyOrderDto[], void>({
      query: () => "orders/pending-subsidy-approval",
      providesTags: (result) =>
        result
          ? [
              { type: "PendingSubsidyOrders" as const, id: "LIST" },
              ...result.map((o) => ({
                type: "PendingSubsidyOrders" as const,
                id: o.id,
              })),
            ]
          : [{ type: "PendingSubsidyOrders" as const, id: "LIST" }],
    }),

    approveSubsidy: build.mutation<unknown, number>({
      query: (orderId) => ({
        url: `orders/${orderId}/approve-subsidy`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _err, orderId) => [
        { type: "PendingSubsidyOrders", id: "LIST" },
        { type: "Orders", id: orderId },
      ],
    }),

    rejectSubsidy: build.mutation<
      unknown,
      { orderId: number; body: RejectSubsidyRequest }
    >({
      query: ({ orderId, body }) => ({
        url: `orders/${orderId}/reject-subsidy`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _err, { orderId }) => [
        { type: "PendingSubsidyOrders", id: "LIST" },
        { type: "Orders", id: orderId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPendingSubsidyApprovalQuery,
  useApproveSubsidyMutation,
  useRejectSubsidyMutation,
} = ordersSubsidyApi;
