import type { CreditTab } from "../types";

export const CREDIT_TABS: { value: CreditTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "disapproved", label: "Disapproved" },
];
