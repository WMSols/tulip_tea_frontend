export interface WeeklyRouteSchedule {
  id: number;
  assignee_type: string;
  assignee_id: number;
  assignee_name: string;
  route_id: number;
  route_name: string;
  day_of_week: number;
  is_active: boolean;
  created_by_distributor: number;
  created_at: string;
}

export interface CreateWeeklyRoutePayload {
  assignee_type: string;
  assignee_id: number;
  route_id: number;
  day_of_week: number;
}

export interface UpdateWeeklyRoutePayload {
  route_id: number;
  day_of_week: number;
  is_active: boolean;
}

/** POST /visit-tasks/generate — request body */
export interface GenerateVisitTasksPayload {
  weeks_ahead: number;
  assignee_type: string;
}

/** POST /visit-tasks/generate — response */
export interface GenerateVisitTasksResponse {
  message: string;
  tasks_generated: number;
  tasks_skipped: number;
}

/** 0 = Monday, 1 = Tuesday, ... 6 = Sunday (ISO-style, for getDayName / API) */
const DAY_NAMES_BY_INDEX = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/** Monday first, Sunday last — use for dropdown order */
const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const WEEKLY_DAYS_MONDAY_FIRST: number[] = [0, 1, 2, 3, 4, 5, 6];

export function getDayName(day: number): string {
  return DAY_NAMES_BY_INDEX[day] ?? `Day ${day}`;
}
