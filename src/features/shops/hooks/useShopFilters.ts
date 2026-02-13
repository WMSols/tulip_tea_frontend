import { useMemo, useState, useCallback } from "react";
import type { ActiveTab, UiShop } from "../types";

interface RouteOption {
  id: number;
  name: string;
  zone_id: number;
}

/**
 * Hook to manage shop filters
 */
export function useShopFilters(
  shops: UiShop[],
  zones: any[],
  routes: RouteOption[] = [],
) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [filterZone, setFilterZone] = useState<string>("all");
  const [filterRoute, setFilterRoute] = useState<string>("all");

  // When zone changes, reset route filter
  const handleZoneChange = useCallback((zone: string) => {
    setFilterZone(zone);
    setFilterRoute("all");
  }, []);

  const zoneOptions = useMemo(() => {
    return zones.map((z) => ({
      id: z.id,
      name: z.name,
    }));
  }, [zones]);

  // Route options filtered by selected zone
  const routeOptions = useMemo(() => {
    if (filterZone === "all") {
      return routes.map((r) => ({ id: r.id, name: r.name }));
    }
    const zone = zones.find((z) => z.name === filterZone);
    if (!zone) return [];
    return routes
      .filter((r) => r.zone_id === zone.id)
      .map((r) => ({ id: r.id, name: r.name }));
  }, [routes, zones, filterZone]);

  const filteredShops = useMemo(() => {
    return shops
      .filter((s) => activeTab === "all" || s.status === activeTab)
      .filter((s) => filterZone === "all" || s.zone === filterZone)
      .filter(
        (s) =>
          filterRoute === "all" ||
          s.routes.some((r) => r.name === filterRoute),
      );
  }, [shops, activeTab, filterZone, filterRoute]);

  return {
    activeTab,
    setActiveTab,
    filterZone,
    setFilterZone: handleZoneChange,
    filterRoute,
    setFilterRoute,
    zoneOptions,
    routeOptions,
    filteredShops,
  };
}
