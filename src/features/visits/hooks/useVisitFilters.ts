import { useMemo, useState } from "react";
import type { ActiveTab, VisitRow } from "../types";

/**
 * Hook to manage visit filters
 */
export function useVisitFilters(rows: VisitRow[]) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [filterZone, setFilterZone] = useState<string>("all");

  const zoneOptions = useMemo(() => {
    const ids = new Set<number>();
    for (const r of rows) ids.add(r.shop_zone_id);
    return Array.from(ids).sort((a, b) => a - b);
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows
      .filter((r) => {
        if (activeTab === "all") return true;
        if (activeTab === "deliveries") return r.kind === "delivery";
        return (
          r.kind === "shop_visit" && r.visit_types.includes("order_booking")
        );
      })
      .filter(
        (r) => filterZone === "all" || String(r.shop_zone_id) === filterZone,
      );
  }, [rows, activeTab, filterZone]);

  const stats = useMemo(() => {
    const totalCount = rows.length;
    const orderBookingCount = rows.filter(
      (r) => r.kind === "shop_visit" && r.visit_types.includes("order_booking"),
    ).length;
    const deliveriesCount = rows.filter((r) => r.kind === "delivery").length;

    return { totalCount, orderBookingCount, deliveriesCount };
  }, [rows]);

  return {
    activeTab,
    setActiveTab,
    filterZone,
    setFilterZone,
    zoneOptions,
    filteredRows,
    stats,
  };
}
