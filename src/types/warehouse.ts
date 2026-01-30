export interface Warehouse {
  id: number;
  name: string;
  zone_id: number;
  address: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateWarehouseRequest {
  name: string;
  zone_id: number;
  address: string;
}

export type ListWarehousesResponse = Warehouse[];

export interface WarehouseInventoryItem {
  id: number;
  warehouse_id: number;
  product_id: number;
  product_name: string;
  product_code: string;
  item_name: string;
  item_code: string;
  unit: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export type GetWarehouseInventoryResponse = WarehouseInventoryItem[];

export interface AddWarehouseInventoryRequest {
  product_id: number;
  quantity: number;
}

export interface UpdateWarehouseInventoryRequest {
  product_id: number;
  quantity: number;
}

// ...existing code...

export interface WarehouseDeliveryMan {
  id: number;
  name: string;
  zone_id: number;
  phone: string;
  assigned_at: string;
}

export type GetWarehouseDeliveryMenResponse = WarehouseDeliveryMan[];

export interface AssignDeliveryManRequest {
  warehouse_id: number;
  delivery_man_id: number;
}

export interface RemoveDeliveryManRequest {
  warehouse_id: number;
  delivery_man_id: number;
}
