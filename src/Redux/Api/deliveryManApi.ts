import { baseApi } from "@/Redux/Api/baseApi";
import {
  DeliveryMan,
  CreateDeliveryManPayload,
  UpdateDeliveryManPayload,
} from "@/types/staff";

export const deliveryManApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDeliveryMan: builder.mutation<
      DeliveryMan,
      { distributor_id: number; body: CreateDeliveryManPayload }
    >({
      query: ({ distributor_id, body }) => ({
        url: `/delivery-men/${distributor_id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "DeliveryMan", id: "LIST" }],
    }),

    getDeliveryMenByDistributor: builder.query<
      DeliveryMan[],
      { distributor_id: number }
    >({
      query: ({ distributor_id }) =>
        `/delivery-men/distributor/${distributor_id}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((x) => ({
                type: "DeliveryMan" as const,
                id: x.id,
              })),
              { type: "DeliveryMan" as const, id: "LIST" },
            ]
          : [{ type: "DeliveryMan" as const, id: "LIST" }],
    }),

    updateDeliveryMan: builder.mutation<DeliveryMan, UpdateDeliveryManPayload>({
      query: ({ delivery_man_id, ...body }) => ({
        url: `/delivery-men/${delivery_man_id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (r, e, arg) => [
        { type: "DeliveryMan", id: arg.delivery_man_id },
        { type: "DeliveryMan", id: "LIST" },
      ],
    }),

    deleteDeliveryMan: builder.mutation<
      { success: boolean },
      { delivery_man_id: number }
    >({
      query: ({ delivery_man_id }) => ({
        url: `/delivery-men/${delivery_man_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (r, e, arg) => [
        { type: "DeliveryMan", id: arg.delivery_man_id },
        { type: "DeliveryMan", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateDeliveryManMutation,
  useGetDeliveryMenByDistributorQuery,
  useUpdateDeliveryManMutation,
  useDeleteDeliveryManMutation,
} = deliveryManApi;
