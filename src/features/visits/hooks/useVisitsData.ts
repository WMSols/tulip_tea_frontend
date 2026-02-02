import { useMemo } from "react";
import type { DeliveryDto, ShopVisitDto } from "@/types/visits";
import type { VisitRow, ShopVisitRow } from "../types";
import { getVisitTime } from "../utils/helpers";
import {
  useGetDeliveriesByDistributorQuery,
  useGetShopVisitsAllQuery,
} from "@/Redux/Api/visitsApi";
import { VISITS_QUERY_LIMIT, DEFAULT_DISTRIBUTOR_ID } from "../utils/constants";

/**
 * Hook to fetch and transform visits data
 */
export function useVisitsData() {
  const {
    data: shopVisits = [],
    isLoading: isLoadingShopVisits,
    isError: isShopVisitsError,
  } = useGetShopVisitsAllQuery({ limit: VISITS_QUERY_LIMIT });

  const {
    data: deliveries = [],
    isLoading: isLoadingDeliveries,
    isError: isDeliveriesError,
  } = useGetDeliveriesByDistributorQuery({
    distributorId: DEFAULT_DISTRIBUTOR_ID,
    limit: VISITS_QUERY_LIMIT,
  });

  const rows: VisitRow[] = useMemo(() => {
    const svRows: VisitRow[] = (shopVisits ?? []).map((v: ShopVisitDto) => {
      const staffName = v.order_booker_name ?? v.delivery_man_name ?? "Unknown";

      const staffRole: ShopVisitRow["staff_role"] =
        v.order_booker_id != null
          ? "order_booker"
          : v.delivery_man_id != null
            ? "delivery_man"
            : "unknown";

      const photos =
        Array.isArray(v.photos) && v.photos.length > 0
          ? v.photos
          : v.photo
            ? [v.photo]
            : [];

      return {
        rowKey: `SV-${v.id}`,
        kind: "shop_visit",
        id: v.id,
        shop_id: v.shop_id,
        shop_name: v.shop_name,
        shop_zone_id: v.shop_zone_id,
        staff_name: staffName,
        staff_role: staffRole,
        visit_types: v.visit_types ?? [],
        gps_lat: v.gps_lat,
        gps_lng: v.gps_lng,
        visit_time: v.visit_time,
        photos,
        reason: v.reason,
        order_id: v.order_id,
        collection_id: v.collection_id,
      };
    });

    const dRows: VisitRow[] = (deliveries ?? []).map((d: DeliveryDto) => ({
      rowKey: `DL-${d.id}`,
      kind: "delivery",
      id: d.id,
      order_id: d.order_id,
      shop_id: d.shop_id,
      shop_name: d.shop_name,
      shop_zone_id: d.shop_zone_id,
      delivery_man_name: d.delivery_man_name,
      status: d.status,
      picked_up_at: d.picked_up_at,
      delivered_at: d.delivered_at,
      returned_at: d.returned_at,
      pickup_gps_lat: d.pickup_gps_lat,
      pickup_gps_lng: d.pickup_gps_lng,
      delivery_gps_lat: d.delivery_gps_lat,
      delivery_gps_lng: d.delivery_gps_lng,
      return_gps_lat: d.return_gps_lat,
      return_gps_lng: d.return_gps_lng,
      delivery_remarks: d.delivery_remarks,
      return_reason: d.return_reason,
      delivery_images: d.delivery_images ?? [],
      delivery_items_count: d.delivery_items?.length ?? 0,
      created_at: d.created_at,
    }));

    // Sort by newest first
    const all = [...svRows, ...dRows];
    all.sort((a, b) => getVisitTime(b) - getVisitTime(a));

    return all;
  }, [shopVisits, deliveries]);

  const isLoading = isLoadingShopVisits || isLoadingDeliveries;
  const isError = isShopVisitsError || isDeliveriesError;

  return { rows, isLoading, isError };
}
