import { baseApi } from "@/Redux/Api/baseApi";
import {
  Route,
  CreateRouteRequest,
  GetRoutesArgs,
  AssignRouteRequest,
} from "@/types/routes";

export const routesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // -----------------------------
    // GET Routes (Distributor / Zone) + Search
    // -----------------------------
    getRoutes: builder.query<Route[], GetRoutesArgs>({
      query: ({ filterType, filterId }) => {
        let url =
          filterType === "distributor"
            ? `/routes/distributor/${filterId}`
            : `/routes/zone/${filterId}`;

        return url;
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
    // ASSIGN Route to Order Booker
    // -----------------------------
    assignRoute: builder.mutation<Route, AssignRouteRequest>({
      query: ({ route_id, order_booker_id }) => ({
        url: `/routes/${route_id}/assign`,
        method: "POST",
        body: { order_booker_id },
      }),
      invalidatesTags: (result) =>
        result ? [{ type: "Routes", id: result.id }] : [],
    }),

    // -----------------------------
    // DELETE Route
    // -----------------------------
    deleteRoute: builder.mutation<void, number>({
      query: (route_id) => ({
        url: `/routes/${route_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Routes", id },
        { type: "Routes", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRoutesQuery,
  useCreateRouteMutation,
  useDeleteRouteMutation,
  useAssignRouteMutation,
} = routesApi;
