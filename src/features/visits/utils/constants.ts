import type { ActiveTab } from "../types";

export const TAB_OPTIONS: { value: ActiveTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "order_booking", label: "Order Booking" },
  { value: "deliveries", label: "Deliveries" },
];

export const VISITS_QUERY_LIMIT = 1000;
