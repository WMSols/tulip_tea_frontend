import type { VisitRow } from "../types";

/**
 * Generates a zone label from a zone ID
 */
export function zoneLabel(zoneId: number | null | undefined): string {
  if (!zoneId) return "Zone -";
  return `Zone ${zoneId}`;
}

/**
 * Generates a Google Maps link from coordinates
 */
export function mapsLink(
  lat: number | null,
  lng: number | null,
): string | null {
  if (lat == null || lng == null) return null;
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

/**
 * Gets the appropriate badge status for a delivery
 */
export function getDeliveryBadgeStatus(
  status: string,
): "success" | "warning" | "info" | "neutral" {
  const s = String(status ?? "").toLowerCase();
  if (s === "delivered") return "success";
  if (s === "returned") return "warning";
  if (s === "picked_up") return "info";
  return "neutral";
}

/**
 * Gets the staff role label
 */
export function getStaffRoleLabel(
  role: "order_booker" | "delivery_man" | "unknown",
): string {
  if (role === "order_booker") return "Order Booker";
  if (role === "delivery_man") return "Delivery Man";
  return "Unknown";
}

/**
 * Gets the time for sorting a visit row
 */
export function getVisitTime(row: VisitRow): number {
  if (row.kind === "shop_visit") {
    return new Date(row.visit_time).getTime();
  }
  return new Date(
    row.delivered_at ?? row.returned_at ?? row.picked_up_at ?? row.created_at,
  ).getTime();
}

/**
 * Gets the display time for a visit row
 */
export function getVisitDisplayTime(row: VisitRow): string {
  if (row.kind === "shop_visit") {
    return row.visit_time;
  }
  return (
    row.delivered_at ?? row.returned_at ?? row.picked_up_at ?? row.created_at
  );
}
