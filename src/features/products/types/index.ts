import type { Product } from "@/types/product";

// Re-export base type
export type { Product };

// UI-specific types
export interface ProductStats {
  total: number;
  active: number;
  inactive: number;
}

export interface ProductFormData {
  code: string;
  name: string;
  unit: string;
  price: string;
  is_active: boolean;
}

export type ProductDialogMode = "create" | "edit";
