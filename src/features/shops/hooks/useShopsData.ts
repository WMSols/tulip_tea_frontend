import { useMemo } from "react";
import { useAppSelector } from "@/Redux/Hooks/hooks";
import { useGetAllShopsQuery } from "@/Redux/Api/shopsApi";
import { useGetZonesQuery } from "@/Redux/Api/zonesApi";
import { mapApiShopToUi } from "../utils/helpers";
import type { UiShop } from "../types";

/**
 * Hook to fetch and transform shops data
 */
export function useShopsData() {
  const distributorId = useAppSelector((s) => s.auth.user!.id);
  const { data: allShops = [], isLoading } = useGetAllShopsQuery(distributorId);
  const { data: zones = [], isLoading: isLoadingZones } = useGetZonesQuery();

  const zoneMap = useMemo(() => {
    const map: Record<number, string> = {};
    zones.forEach((z) => {
      map[z.id] = z.name;
    });
    return map;
  }, [zones]);

  const shops: UiShop[] = useMemo(() => {
    return allShops.map((s) => mapApiShopToUi(s, zoneMap));
  }, [allShops, zoneMap]);

  const stats = useMemo(() => {
    const totalCount = shops.length;
    const activeCount = shops.filter((s) => s.status === "active").length;
    const pendingCount = shops.filter((s) => s.status === "pending").length;
    const totalOutstanding = shops
      .filter((s) => s.status === "active")
      .reduce((acc, s) => acc + s.balance, 0);

    return { totalCount, activeCount, pendingCount, totalOutstanding };
  }, [shops]);

  return {
    shops,
    zones,
    zoneMap,
    stats,
    isLoading: isLoading || isLoadingZones,
  };
}
