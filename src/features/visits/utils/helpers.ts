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
 * Formats a visit type slug into a readable label
 */
export function formatVisitTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    order_booking: "Order Booking",
    daily_collections: "Daily Collections",
    delivery: "Delivery",
    recovery: "Recovery",
    complaint: "Complaint",
    stock_check: "Stock Check",
  };
  return labels[type] ?? type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Gets badge status for a visit type
 */
export function getVisitTypeBadgeStatus(
  type: string,
): "info" | "warning" | "success" | "neutral" {
  if (type === "order_booking") return "info";
  if (type === "daily_collections") return "warning";
  if (type === "delivery") return "success";
  return "neutral";
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
