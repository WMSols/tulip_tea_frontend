import type { ProductFormData } from "../types";

/**
 * Available units for products
 */
export const PRODUCT_UNITS = ["kg", "pcs", "box", "pack"] as const;

/**
 * Initial form state for creating a new product
 */
export const INITIAL_PRODUCT_FORM: ProductFormData = {
  code: "",
  name: "",
  unit: "",
  price: "",
  is_active: true,
};
