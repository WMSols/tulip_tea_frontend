export type ISODateTimeString = string;

export interface ShopRouteInfo {
  route_id: number;
  route_name: string;
  zone_id: number;
}

/** GET shop-visits/all?limit=1000 */
export interface ShopVisitDto {
  id: number;
  shop_id: number;
  shop_name: string;
  shop_zone_id: number;
  shop_routes: ShopRouteInfo[];

  order_booker_id: number | null;
  order_booker_name: string | null;

  delivery_man_id: number | null;
  delivery_man_name: string | null;

  visit_types: ShopVisitType[];
  gps_lat: number | null;
  gps_lng: number | null;

  visit_time: ISODateTimeString;

  /** legacy single photo (can be null) */
  photo: string | null;

  /** preferred photos array */
  photos: string[];

  reason: string | null;
  order_id: number | null;
  collection_id: number | null;
}

export type ShopVisitType =
  | "order_booking"
  | "delivery"
  | "recovery"
  | "complaint"
  | "stock_check"
  | (string & {});

/** GET deliveries/distributor/{distributor_id}?limit=1000 */
export interface DeliveryDto {
  id: number;
  order_id: number;
  delivery_man_id: number;
  delivery_man_name: string;

  warehouse_id: number;

  shop_id: number;
  shop_name: string;
  shop_zone_id: number;

  status: DeliveryStatus;

  picked_up_at: ISODateTimeString | null;
  pickup_gps_lat: number | null;
  pickup_gps_lng: number | null;

  delivered_at: ISODateTimeString | null;
  delivery_gps_lat: number | null;
  delivery_gps_lng: number | null;

  delivery_remarks: string | null;
  delivery_images: string[];

  returned_at: ISODateTimeString | null;
  return_gps_lat: number | null;
  return_gps_lng: number | null;
  return_reason: string | null;

  created_at: ISODateTimeString;
  updated_at: ISODateTimeString | null;

  delivery_items: DeliveryItemDto[];
}

export type DeliveryStatus =
  | "pending"
  | "picked_up"
  | "delivered"
  | "returned"
  | "cancelled"
  | (string & {});

export interface DeliveryItemDto {
  id: number;
  order_item_id: number;

  product_id: number | null;
  inventory_item_id: number | null;

  quantity_picked_up: number;
  quantity_delivered: number;
  quantity_returned: number;
}

/** GET /orders/{order_id} */
export interface OrderDto {
  id: number;

  shop_id: number;
  shop_name: string;

  order_booker_id: number | null;
  order_booker_name: string | null;

  distributor_id: number | null;

  delivery_man_id: number | null;
  delivery_man_name: string | null;

  visit_id: number | null;

  total_amount: number;
  status: OrderStatus;

  scheduled_date: string | null;

  order_items: OrderItemDto[];

  delivery_remarks: string | null;
  delivery_images: string[];

  created_at: ISODateTimeString;
  updated_at: ISODateTimeString | null;
}

export type OrderStatus =
  | "PENDING"
  | "APPROVED"
  | "CONFIRMED"
  | "CANCELLED"
  | "DELIVERED"
  | "RETURNED"
  | (string & {});

export interface OrderItemDto {
  id: number;
  order_id: number;

  product_name: string;
  quantity: number;

  unit_price: number;
  total_price: number;
}

/** GET /daily-collections/{collection_id} */
export interface DailyCollectionDto {
  id: number;
  shop_id: number;
  shop_name: string;
  shop_owner: string;
  order_id: number;
  collected_by_order_booker: number;
  order_booker_name: string;
  collected_by_delivery_man: number;
  delivery_man_name: string;
  verified_by_distributor: number;
  amount: number;
  status: string;
  visit_id: number;
  collection_date: string;
  photo_proof: string | null;
  shop_outstanding_balance: number;
  shop_credit_limit: number;
  shop_available_credit: number;
}
