import type { ApiShop } from "@/types/shops";
import type { UiShop, ShopStatus } from "../types";

/**
 * Maps API shop response to UI shop format
 */
export function mapApiShopToUi(
  shop: ApiShop,
  zoneMap: Record<number, string>,
): UiShop {
  return {
    id: shop.id,
    name: shop.name,
    ownerName: shop.owner_name,
    phone: shop.owner_phone,
    zoneId: shop.zone_id,
    zone: zoneMap[shop.zone_id] || `Zone ${shop.zone_id}`,
    routes:
      shop.routes?.map((r) => ({
        id: r.route_id,
        name: r.route_name,
        sequence: r.sequence,
      })) ?? [],
    gps: `${shop.gps_lat},${shop.gps_lng}`,
    creditLimit: shop.credit_limit,
    balance: shop.outstanding_balance,
    status: mapRegistrationStatus(shop.registration_status),
    createdAt: shop.created_at,
    assignedOrderBookerId: shop.assigned_to_order_booker,
    assignedOrderBookerName: shop.assigned_to_order_booker_name,
    cnicFrontPhoto: shop.owner_cnic_front_photo || null,
    cnicBackPhoto: shop.owner_cnic_back_photo || null,
  };
}

/**
 * Maps registration status from API to UI format
 */
function mapRegistrationStatus(status: string): ShopStatus {
  if (status === "approved") return "active";
  if (status === "pending") return "pending";
  return "rejected";
}

/**
 * Gets badge status based on shop status
 */
export function getShopBadgeStatus(
  status: ShopStatus,
): "success" | "warning" | "danger" {
  switch (status) {
    case "active":
      return "success";
    case "pending":
      return "warning";
    case "rejected":
      return "danger";
  }
}

/**
 * Gets Google Maps link from GPS coordinates
 */
export function getMapsLink(gps: string): string {
  return `https://www.google.com/maps?q=${gps}`;
}

/**
 * Checks if balance is overdue
 */
export function isBalanceOverdue(balance: number): boolean {
  return balance > 0;
}
