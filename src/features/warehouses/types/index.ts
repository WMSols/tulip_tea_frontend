import type {
  Warehouse,
  WarehouseInventoryItem,
  WarehouseDeliveryMan,
} from "@/types/warehouse";
import type { Zone } from "@/types/zones";

// Re-export base types
export type { Warehouse, WarehouseInventoryItem, WarehouseDeliveryMan, Zone };

// UI-specific types
export interface WarehouseStats {
  total: number;
  active: number;
  inactive: number;
  zones: number;
}

export interface CreateWarehouseForm {
  name: string;
  zone_id: string;
  address: string;
}

export interface AddInventoryForm {
  product_id: string;
  quantity: string;
}

export interface DeliveryMan {
  id: number;
  name?: string;
  full_name?: string;
  phone?: string;
  zone_id?: number;
}

export interface Product {
  id: number;
  name?: string;
  product_name?: string;
}

// Dialog state types
export interface ManageDialogData {
  warehouse: Warehouse | null;
  zone: Zone | null;
}
