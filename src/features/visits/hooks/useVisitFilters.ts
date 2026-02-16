import { useMemo, useState, useCallback } from "react";
import type { ActiveTab, VisitRow } from "../types";

interface ZoneInfo {
  id: number;
  name: string;
}

/**
 * Hook to manage visit filters
 */
export function useVisitFilters(rows: VisitRow[], zones: ZoneInfo[] = []) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [filterZone, setFilterZone] = useState<string>("all");
  const [filterRoute, setFilterRoute] = useState<string>("all");

  // When zone changes, reset route filter
  const handleZoneChange = useCallback((zone: string) => {
    setFilterZone(zone);
    setFilterRoute("all");
  }, []);

  // Zone options with names, only for zones that appear in actual data
  const zoneOptions = useMemo(() => {
    const idsInData = new Set<number>();
    for (const r of rows) idsInData.add(r.shop_zone_id);

    return zones
      .filter((z) => idsInData.has(z.id))
      .map((z) => ({ id: z.id, name: z.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [rows, zones]);

  // Route options extracted from visit data, filtered by selected zone
  const routeOptions = useMemo(() => {
    const seen = new Map<number, { id: number; name: string; zone_id: number }>();
    for (const r of rows) {
      for (const sr of r.shop_routes) {
        if (!seen.has(sr.route_id)) {
          seen.set(sr.route_id, {
            id: sr.route_id,
            name: sr.route_name,
            zone_id: sr.zone_id,
          });
        }
      }
    }

    const all = Array.from(seen.values());

    if (filterZone === "all") {
      return all.map((r) => ({ id: r.id, name: r.name }));
    }

    const zoneId = Number(filterZone);
    return all
      .filter((r) => r.zone_id === zoneId)
      .map((r) => ({ id: r.id, name: r.name }));
  }, [rows, filterZone]);

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
      )
      .filter(
        (r) =>
          filterRoute === "all" ||
          r.shop_routes.some((sr) => sr.route_name === filterRoute),
      );
  }, [rows, activeTab, filterZone, filterRoute]);

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
    setFilterZone: handleZoneChange,
    filterRoute,
    setFilterRoute,
    zoneOptions,
    routeOptions,
    filteredRows,
    stats,
  };
}
