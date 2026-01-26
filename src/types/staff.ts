export interface BaseStaff {
  id: number;
  name: string;
  phone: string;
  email?: string;
  zone_id: number;
  distributor_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/* ---------- ORDER BOOKER ---------- */
export interface OrderBooker extends BaseStaff {
  role: "order_booker";
}

export interface CreateOrderBookerPayload {
  name: string;
  phone: string;
  password: string;
  email?: string;
  zone_id: number;
}

export interface UpdateOrderBookerPayload {
  order_booker_id: number;
  name?: string;
  phone?: string;
  password?: string;
  email?: string;
  zone_id?: number;
}

/* ---------- DELIVERY MAN ---------- */
export interface DeliveryMan extends BaseStaff {
  role: "delivery_man";
}

export interface CreateDeliveryManPayload {
  name: string;
  phone: string;
  password: string;
  email?: string;
  zone_id: number;
}

export interface UpdateDeliveryManPayload {
  delivery_man_id: number;
  name?: string;
  phone?: string;
  password?: string;
  email?: string;
  zone_id?: number;
}
