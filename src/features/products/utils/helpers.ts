import type { Product, ProductStats, ProductFormData } from "../types";

/**
 * Calculate product statistics
 */
export const calculateProductStats = (products: Product[]): ProductStats => {
  const active = products.filter((p) => p.is_active).length;
  
  return {
    total: products.length,
    active,
    inactive: products.length - active,
  };
};

/**
 * Validate product form data
 */
export const validateProductForm = (
  form: ProductFormData
): { valid: boolean; error?: string } => {
  if (!form.code.trim()) {
    return { valid: false, error: "Product code is required" };
  }

  if (!form.name.trim()) {
    return { valid: false, error: "Product name is required" };
  }

  if (!form.unit) {
    return { valid: false, error: "Unit is required" };
  }

  const price = Number(form.price);
  if (Number.isNaN(price) || price <= 0) {
    return { valid: false, error: "Valid price is required" };
  }

  return { valid: true };
};

/**
 * Get product status variant for StatusBadge
 */
export const getProductStatusVariant = (isActive: boolean): "success" | "neutral" => {
  return isActive ? "success" : "neutral";
};

/**
 * Get product status label
 */
export const getProductStatusLabel = (isActive: boolean): string => {
  return isActive ? "Active" : "Inactive";
};

/**
 * Convert Product to ProductFormData
 */
export const productToFormData = (product: Product): ProductFormData => {
  return {
    code: product.code,
    name: product.name,
    unit: product.unit,
    price: String(product.price),
    is_active: product.is_active,
  };
};
