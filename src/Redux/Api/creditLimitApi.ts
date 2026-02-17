import { baseApi } from "@/Redux/Api/baseApi";
import {
  CreditLimitRequest,
  UpdateCreditLimitRequest,
  ApproveRejectCreditLimitRequest,
} from "@/types/creditLimit";

export const creditLimitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCreditLimitRequests: builder.query<CreditLimitRequest[], number>({
      query: (distributorId) =>
        `/credit-limit-requests/all?distributor_id=${distributorId}`,
      providesTags: ["CreditLimitRequests"],
    }),

    updateCreditLimitRequest: builder.mutation<
      void,
      { requestId: number; body: UpdateCreditLimitRequest }
    >({
      query: ({ requestId, body }) => ({
        url: `/credit-limit-requests/${requestId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["CreditLimitRequests"],
    }),

    approveCreditLimitRequest: builder.mutation<
      void,
      {
        requestId: number;
        distributorId: number;
        body: ApproveRejectCreditLimitRequest;
      }
    >({
      query: ({ requestId, distributorId, body }) => ({
        url: `/credit-limit-requests/${requestId}/approve?distributor_id=${distributorId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CreditLimitRequests"],
    }),

    rejectCreditLimitRequest: builder.mutation<
      void,
      {
        requestId: number;
        distributorId: number;
        body: ApproveRejectCreditLimitRequest;
      }
    >({
      query: ({ requestId, distributorId, body }) => ({
        url: `/credit-limit-requests/${requestId}/reject?distributor_id=${distributorId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CreditLimitRequests"],
    }),

    deleteCreditLimitRequest: builder.mutation<void, number>({
      query: (requestId) => ({
        url: `/credit-limit-requests/${requestId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CreditLimitRequests"],
    }),
  }),
});

export const {
  useGetAllCreditLimitRequestsQuery,
  useUpdateCreditLimitRequestMutation,
  useApproveCreditLimitRequestMutation,
  useRejectCreditLimitRequestMutation,
  useDeleteCreditLimitRequestMutation,
} = creditLimitApi;
