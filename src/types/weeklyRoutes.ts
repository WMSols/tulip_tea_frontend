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

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getDayName(day: number): string {
  return DAYS_OF_WEEK[day] ?? `Day ${day}`;
}
