export interface Product {
  id: number;
  code: string;
  name: string;
  unit: string;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  code: string;
  name: string;
  unit: string;
  price: number;
}

export interface UpdateProductRequest {
  product_id: number;
  code?: string;
  name?: string;
  unit?: string;
  price?: number;
  is_active?: boolean;
}
