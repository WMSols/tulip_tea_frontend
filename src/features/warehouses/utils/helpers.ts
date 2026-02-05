import type { Warehouse, WarehouseStats, Zone } from "../types";

/**
 * Calculate warehouse statistics
 */
export const calculateWarehouseStats = (
  warehouses: Warehouse[],
): WarehouseStats => {
  const active = warehouses.filter((w) => w.is_active).length;
  const inactive = warehouses.length - active;
  const zones = new Set(warehouses.map((w) => w.zone_id)).size;

  return {
    total: warehouses.length,
    active,
    inactive,
    zones,
  };
};

/**
 * Find zone by ID
 */
export const findZoneById = (
  zones: Zone[],
  zoneId: number | null | undefined,
): Zone | undefined => {
  if (!zoneId) return undefined;
  return zones.find((z) => z.id === zoneId);
};

/**
 * Validate warehouse form
 */
export const validateWarehouseForm = (form: {
  name: string;
  address: string;
  zone_id: string;
}): { valid: boolean; error?: string } => {
  const zone_id = Number(form.zone_id);

  if (!form.name.trim()) {
    return { valid: false, error: "Warehouse name is required" };
  }

  if (!form.address.trim()) {
    return { valid: false, error: "Address is required" };
  }

  if (Number.isNaN(zone_id)) {
    return { valid: false, error: "Valid zone selection is required" };
  }

  return { valid: true };
};

/**
 * Validate inventory form
 */
export const validateInventoryForm = (form: {
  product_id: string;
  quantity: string;
}): { valid: boolean; error?: string } => {
  const product_id = Number(form.product_id);
  const quantity = Number(form.quantity);

  if (Number.isNaN(product_id)) {
    return { valid: false, error: "Please select a product" };
  }

  if (Number.isNaN(quantity) || quantity <= 0) {
    return { valid: false, error: "Please enter a valid quantity" };
  }

  return { valid: true };
};

/**
 * Validate quantity update
 */
export const validateQuantity = (
  value: string | null | undefined,
): { valid: boolean; error?: string } => {
  if (value == null || value === "") {
    return { valid: false, error: "Quantity is required" };
  }

  const quantity = Number(value);

  if (Number.isNaN(quantity) || quantity < 0) {
    return { valid: false, error: "Please enter a valid quantity" };
  }

  return { valid: true };
};

/**
 * Get warehouse status badge variant
 */
export const getWarehouseStatusVariant = (
  isActive: boolean,
): "success" | "warning" => {
  return isActive ? "success" : "warning";
};

/**
 * Get warehouse status label
 */
export const getWarehouseStatusLabel = (isActive: boolean): string => {
  return isActive ? "Active" : "Inactive";
};
