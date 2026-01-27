export interface ApiShop {
  id: number;
  name: string;
  owner_name: string;
  owner_phone: string;
  gps_lat: number;
  gps_lng: number;
  credit_limit: number;
  legacy_balance: number;
  outstanding_balance: number;
  is_registered: boolean;
  registration_status: string; // "pending" | "approved" | "rejected"
  verified_by_distributor: number | null;
  verified_at: string | null;
  zone_id: number;
  created_by_order_booker: number;
  created_by_order_booker_name: string;
  assigned_to_order_booker: number;
  assigned_to_order_booker_name: string;
  routes: string[];
  owner_cnic_front_photo: string;
  owner_cnic_back_photo: string;
  shop_exterior_photo: string;
  owner_photo: string;
  credit_limit_request_id: number | null;
  created_at: string;
}

export interface VerifyShopRequest {
  registration_status: "approved" | "rejected";
  remarks?: string;
}

export interface ReassignShopRequest {
  shop_id: number;
  new_order_booker_id: number;
}

export type ShopStatus = "active" | "pending" | "rejected" | "deleted";

export interface UiShop {
  id: number;
  name: string;
  ownerName: string;
  phone: string;
  zone: string;
  route: string;
  gps: string;
  creditLimit: number;
  balance: number;
  status: ShopStatus;
  createdAt: string;
  assignedOrderBookerId?: number;
  assignedOrderBookerName?: string;
}
