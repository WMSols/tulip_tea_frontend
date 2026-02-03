import type { ActiveTab } from "../types";

export const TAB_OPTIONS: { value: ActiveTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
];

export const REJECTION_REASON = "Rejected by distributor";
