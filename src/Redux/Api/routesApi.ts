// Redux/Api/routesApi.ts

import { baseApi } from "@/Redux/Api/baseApi";
import {
  Route,
  CreateRouteRequest,
  GetRoutesArgs,
  AssignRouteRequest,
  UpdateRouteRequest,
} from "@/types/routes";

export const routesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // -----------------------------
    // GET Routes
    // -----------------------------
    getRoutes: builder.query<Route[], GetRoutesArgs>({
      query: ({ filterType, filterId }) => {
        return filterType === "zone"
          ? `/routes/zone/${filterId}`
          : `/routes/distributor/${filterId}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((r) => ({ type: "Routes" as const, id: r.id })),
              { type: "Routes", id: "LIST" },
            ]
          : [{ type: "Routes", id: "LIST" }],
    }),

    // -----------------------------
    // CREATE Route
    // -----------------------------
    createRoute: builder.mutation<
      Route,
      { distributor_id: number; body: CreateRouteRequest }
    >({
      query: ({ distributor_id, body }) => ({
        url: `/routes/${distributor_id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Routes", id: "LIST" }],
    }),

    // -----------------------------
    // UPDATE Route  ✅ NEW
    // -----------------------------
    updateRoute: builder.mutation<
      Route,
      { route_id: number; body: UpdateRouteRequest }
    >({
      query: ({ route_id, body }) => ({
        url: `/routes/${route_id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (res) =>
        res
          ? [
              { type: "Routes", id: res.id },
              { type: "Routes", id: "LIST" },
            ]
          : [{ type: "Routes", id: "LIST" }],
    }),

    // -----------------------------
    // ASSIGN Route
    // -----------------------------
    assignRoute: builder.mutation<Route, AssignRouteRequest>({
      query: ({ route_id, order_booker_id }) => ({
        url: `/routes/${route_id}/assign`,
        method: "POST",
        body: { order_booker_id },
      }),
      invalidatesTags: (res) => (res ? [{ type: "Routes", id: res.id }] : []),
    }),

    // -----------------------------
    // DELETE Route
    // -----------------------------
    deleteRoute: builder.mutation<void, number>({
      query: (route_id) => ({
        url: `/routes/${route_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Routes", id },
        { type: "Routes", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetRoutesQuery,
  useCreateRouteMutation,
  useUpdateRouteMutation, // ✅ export
  useDeleteRouteMutation,
  useAssignRouteMutation,
} = routesApi;
