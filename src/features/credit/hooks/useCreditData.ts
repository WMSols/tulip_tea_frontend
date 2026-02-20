import { useMemo } from "react";
import { useGetAllCreditLimitRequestsQuery } from "@/Redux/Api/creditLimitApi";
import type { CreditLimitRequest, CreditTab } from "../types";

interface UseCreditDataReturn {
  data: CreditLimitRequest[];
  filteredRequests: CreditLimitRequest[];
  pendingCount: number;
  isLoading: boolean;
  isFetching: boolean;
}

/**
 * Hook for fetching and filtering credit limit requests
 */
export const useCreditData = (
  distributorId: number | null,
  activeTab: CreditTab,
): UseCreditDataReturn => {
  const { data = [], isLoading, isFetching } =
    useGetAllCreditLimitRequestsQuery(distributorId ?? 0, {
      skip: !distributorId,
    });

  const filteredRequests = useMemo(
    () => (activeTab === "all" ? data : data.filter((r) => r.status === activeTab)),
    [data, activeTab],
  );

  const pendingCount = useMemo(
    () => data.filter((r) => r.status === "pending").length,
    [data],
  );

  return {
    data,
    filteredRequests,
    pendingCount,
    isLoading,
    isFetching,
  };
};
