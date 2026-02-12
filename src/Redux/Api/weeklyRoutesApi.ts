import { baseApi } from "@/Redux/Api/baseApi";
import {
  WeeklyRouteSchedule,
  CreateWeeklyRoutePayload,
  UpdateWeeklyRoutePayload,
} from "@/types/weeklyRoutes";

export const weeklyRoutesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /weekly-route-schedules/distributor/{distributor_id}
    getWeeklyRouteSchedules: builder.query<WeeklyRouteSchedule[], number>({
      query: (distributorId) =>
        `/weekly-route-schedules/distributor/${distributorId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((s) => ({
                type: "WeeklyRouteSchedules" as const,
                id: s.id,
              })),
              { type: "WeeklyRouteSchedules", id: "LIST" },
            ]
          : [{ type: "WeeklyRouteSchedules", id: "LIST" }],
    }),

    // POST /weekly-route-schedules/distributor/{distributor_id}
    createWeeklyRouteSchedule: builder.mutation<
      WeeklyRouteSchedule,
      { distributorId: number; body: CreateWeeklyRoutePayload }
    >({
      query: ({ distributorId, body }) => ({
        url: `/weekly-route-schedules/distributor/${distributorId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "WeeklyRouteSchedules", id: "LIST" }],
    }),

    // PUT /weekly-route-schedules/{schedule_id}
    updateWeeklyRouteSchedule: builder.mutation<
      WeeklyRouteSchedule,
      { scheduleId: number; body: UpdateWeeklyRoutePayload }
    >({
      query: ({ scheduleId, body }) => ({
        url: `/weekly-route-schedules/${scheduleId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { scheduleId }) => [
        { type: "WeeklyRouteSchedules", id: scheduleId },
        { type: "WeeklyRouteSchedules", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetWeeklyRouteSchedulesQuery,
  useCreateWeeklyRouteScheduleMutation,
  useUpdateWeeklyRouteScheduleMutation,
} = weeklyRoutesApi;
