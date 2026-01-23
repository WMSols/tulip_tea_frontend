import { baseApi } from "@/Redux/Api/baseApi";
import { Zone, CreateZoneDTO } from "@/types/zones";

export const zonesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getZones: builder.query<Zone[], void>({
      query: () => "/zones/",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Zones" as const,
                id: id.toString(),
              })),
              { type: "Zones" as const, id: "LIST" },
            ]
          : [{ type: "Zones" as const, id: "LIST" }],
    }),
    getZoneById: builder.query<Zone, string>({
      query: (zone_id) => `/zones/${zone_id}`,
      providesTags: (result, error, id) => [{ type: "Zones" as const, id }],
    }),
    createZone: builder.mutation<Zone, CreateZoneDTO>({
      query: (body) => ({
        url: "/zones/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Zones" as const, id: "LIST" }],
    }),
    deleteZone: builder.mutation<void, number>({
      query: (zone_id) => ({
        url: `/zones/${zone_id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Zones" as const, id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetZonesQuery,
  useGetZoneByIdQuery,
  useCreateZoneMutation,
  useDeleteZoneMutation,
} = zonesApi;
