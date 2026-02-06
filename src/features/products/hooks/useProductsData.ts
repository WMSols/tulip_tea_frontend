import { useMemo } from "react";
import { useGetProductsQuery } from "@/Redux/Api/productsApi";
import { calculateProductStats } from "../utils/helpers";
import type { Product, ProductStats } from "../types";

interface UseProductsDataReturn {
  products: Product[];
  stats: ProductStats;
  isLoading: boolean;
}

/**
 * Hook for fetching and managing product data
 */
export const useProductsData = (): UseProductsDataReturn => {
  const { data: products = [], isLoading } = useGetProductsQuery();

  const stats = useMemo(() => calculateProductStats(products), [products]);

  return {
    products,
    stats,
    isLoading,
  };
};
