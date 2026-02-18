import { useMemo } from "react";
import { useGetWarehousesQuery } from "@/Redux/Api/warehousesApi";
import { useGetZonesQuery } from "@/Redux/Api/zonesApi";
import { useGetProductsQuery } from "@/Redux/Api/productsApi";
import { useGetDeliveryMenByDistributorQuery } from "@/Redux/Api/deliveryManApi";
import { calculateWarehouseStats } from "../utils/helpers";
import type {
  Warehouse,
  WarehouseStats,
  Zone,
  Product,
  DeliveryMan,
} from "../types";

interface UseWarehousesDataReturn {
  warehouses: Warehouse[];
  zones: Zone[];
  products: Product[];
  deliveryMen: DeliveryMan[];
  stats: WarehouseStats;
  isLoading: boolean;
  isLoadingZones: boolean;
}

/**
 * Hook for fetching and managing warehouse data
 */
export const useWarehousesData = (
  distributorId: number | null,
): UseWarehousesDataReturn => {
  const { data: warehouses = [], isLoading: isWarehousesLoading, isFetching: isFetchingWarehouses } =
    useGetWarehousesQuery();
  const { data: zones = [], isLoading: isLoadingZones, isFetching: isFetchingZones } = useGetZonesQuery();
  const { data: products = [] } = useGetProductsQuery();

  const { data: deliveryMen = [] } = useGetDeliveryMenByDistributorQuery(
    { distributor_id: distributorId! },
    { skip: !distributorId },
  );

  const stats = useMemo(
    () => calculateWarehouseStats(warehouses),
    [warehouses],
  );

  return {
    warehouses,
    zones,
    products,
    deliveryMen,
    stats,
    isLoading: isWarehousesLoading || isFetchingWarehouses,
    isLoadingZones: isLoadingZones || isFetchingZones,
  };
};
