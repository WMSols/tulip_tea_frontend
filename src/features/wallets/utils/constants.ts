import type { CollectFormData, RoleFilter } from "../types";

/**
 * Initial state for the collect money form
 */
export const INITIAL_COLLECT_FORM: CollectFormData = {
  amount: "",
  description: "",
};

/**
 * Role filter options for the team wallets list
 */
export const ROLE_FILTER_OPTIONS: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "order_booker", label: "Order Bookers" },
  { value: "delivery_man", label: "Delivery Men" },
];

/**
 * Default transaction query limit
 */
export const TX_QUERY_LIMIT = 50;
