export type ShopStatus = "active" | "pending" | "rejected";

export type ActiveTab = "all" | "active" | "pending";

export interface ShopRoute {
  id: number;
  name: string;
  sequence: number;
}

export interface UiShop {
  id: number;
  name: string;
  ownerName: string;
  phone: string;
  zoneId: number;
  zone: string;
  routes: ShopRoute[];
  gps: string;
  creditLimit: number;
  balance: number;
  status: ShopStatus;
  createdAt: string;
  assignedOrderBookerId: number | null;
  assignedOrderBookerName: string | null;
  cnicFrontPhoto: string | null;
  cnicBackPhoto: string | null;
  shopExteriorPhoto: string | null;
  ownerPhoto: string | null;
}

export interface OrderBooker {
  id: number;
  name: string;
}

export interface Zone {
  id: number;
  name: string;
}
