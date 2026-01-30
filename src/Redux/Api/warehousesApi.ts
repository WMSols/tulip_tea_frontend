import { baseApi } from "@/Redux/Api/baseApi";
import type {
  AddWarehouseInventoryRequest,
  AssignDeliveryManRequest,
  CreateWarehouseRequest,
  GetWarehouseInventoryResponse,
  ListWarehousesResponse,
  GetWarehouseDeliveryMenResponse,
  RemoveDeliveryManRequest,
  UpdateWarehouseInventoryRequest,
} from "@/types/warehouse";

export const warehousesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWarehouses: builder.query<ListWarehousesResponse, void>({
      query: () => ({
        url: "/warehouses/",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Warehouses" as const, id: "LIST" },
              ...result.map((w) => ({ type: "Warehouses" as const, id: w.id })),
            ]
          : [{ type: "Warehouses" as const, id: "LIST" }],
    }),

    createWarehouse: builder.mutation<void, CreateWarehouseRequest>({
      query: (body) => ({
        url: "/warehouses/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Warehouses" as const, id: "LIST" }],
    }),

    getWarehouseInventory: builder.query<
      GetWarehouseInventoryResponse,
      { warehouse_id: number }
    >({
      query: ({ warehouse_id }) => ({
        url: `/warehouses/${warehouse_id}/inventory`,
        method: "GET",
      }),
      providesTags: (_result, _err, arg) => [
        { type: "WarehouseInventory" as const, id: arg.warehouse_id },
      ],
    }),

    addWarehouseInventory: builder.mutation<
      void,
      { warehouse_id: number; body: AddWarehouseInventoryRequest }
    >({
      query: ({ warehouse_id, body }) => ({
        url: `/warehouses/${warehouse_id}/inventory`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _err, arg) => [
        { type: "WarehouseInventory" as const, id: arg.warehouse_id },
      ],
    }),

    updateWarehouseInventory: builder.mutation<
      void,
      {
        warehouse_id: number;
        inventory_id: number;
        body: UpdateWarehouseInventoryRequest;
      }
    >({
      query: ({ warehouse_id, inventory_id, body }) => ({
        url: `/warehouses/${warehouse_id}/inventory/${inventory_id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _err, arg) => [
        { type: "WarehouseInventory" as const, id: arg.warehouse_id },
      ],
    }),

    getWarehouseDeliveryMen: builder.query<
      GetWarehouseDeliveryMenResponse,
      { warehouse_id: number }
    >({
      query: ({ warehouse_id }) => ({
        url: `/warehouses/${warehouse_id}/delivery-men`,
        method: "GET",
      }),
      providesTags: (_res, _err, arg) => [
        { type: "WarehouseDeliveryMen" as const, id: arg.warehouse_id },
      ],
    }),

    assignDeliveryManToWarehouse: builder.mutation<
      void,
      AssignDeliveryManRequest
    >({
      query: ({ warehouse_id, delivery_man_id }) => ({
        url: `/warehouses/${warehouse_id}/delivery-men/${delivery_man_id}`,
        method: "POST",
      }),
      // ✅ refresh assigned list
      invalidatesTags: (_res, _err, arg) => [
        { type: "WarehouseDeliveryMen" as const, id: arg.warehouse_id },
      ],
    }),

    removeDeliveryManFromWarehouse: builder.mutation<
      void,
      RemoveDeliveryManRequest
    >({
      query: ({ warehouse_id, delivery_man_id }) => ({
        url: `/warehouses/${warehouse_id}/delivery-men/${delivery_man_id}`,
        method: "DELETE",
      }),
      // ✅ refresh assigned list
      invalidatesTags: (_res, _err, arg) => [
        { type: "WarehouseDeliveryMen" as const, id: arg.warehouse_id },
      ],
    }),
  }),
});

export const {
  useGetWarehousesQuery,
  useCreateWarehouseMutation,
  useGetWarehouseInventoryQuery,
  useAddWarehouseInventoryMutation,
  useUpdateWarehouseInventoryMutation,
  useGetWarehouseDeliveryMenQuery,
  useAssignDeliveryManToWarehouseMutation,
  useRemoveDeliveryManFromWarehouseMutation,
} = warehousesApi;
