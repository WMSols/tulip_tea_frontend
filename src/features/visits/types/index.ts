import type { ShopRouteInfo } from "@/types/visits";

export type ActiveTab = "all" | "order_booking" | "deliveries";

export type VisitRow =
  | {
      rowKey: string;
      kind: "shop_visit";
      id: number;
      shop_id: number;
      shop_name: string;
      shop_zone_id: number;
      shop_routes: ShopRouteInfo[];
      staff_name: string;
      staff_role: "order_booker" | "delivery_man" | "unknown";
      visit_types: string[];
      gps_lat: number | null;
      gps_lng: number | null;
      visit_time: string;
      photos: string[];
      reason: string | null;
      order_id: number | null;
      collection_id: number | null;
    }
  | {
      rowKey: string;
      kind: "delivery";
      id: number;
      order_id: number;
      shop_id: number;
      shop_name: string;
      shop_zone_id: number;
      shop_routes: ShopRouteInfo[];
      delivery_man_name: string;
      status: string;
      picked_up_at: string | null;
      delivered_at: string | null;
      returned_at: string | null;
      pickup_gps_lat: number | null;
      pickup_gps_lng: number | null;
      delivery_gps_lat: number | null;
      delivery_gps_lng: number | null;
      return_gps_lat: number | null;
      return_gps_lng: number | null;
      delivery_remarks: string | null;
      return_reason: string | null;
      delivery_images: string[];
      delivery_items_count: number;
      created_at: string;
    };

export type ShopVisitRow = Extract<VisitRow, { kind: "shop_visit" }>;
export type DeliveryRow = Extract<VisitRow, { kind: "delivery" }>;
