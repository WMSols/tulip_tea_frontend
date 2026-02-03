import { useMemo, useState } from "react";
import type { ActiveTab, UiShop } from "../types";

/**
 * Hook to manage shop filters
 */
export function useShopFilters(shops: UiShop[], zones: any[]) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [filterZone, setFilterZone] = useState<string>("all");

  const zoneOptions = useMemo(() => {
    return zones.map((z) => ({
      id: z.id,
      name: z.name,
    }));
  }, [zones]);

  const filteredShops = useMemo(() => {
    return shops
      .filter((s) => activeTab === "all" || s.status === activeTab)
      .filter((s) => filterZone === "all" || s.zone === filterZone);
  }, [shops, activeTab, filterZone]);

  return {
    activeTab,
    setActiveTab,
    filterZone,
    setFilterZone,
    zoneOptions,
    filteredShops,
  };
}
