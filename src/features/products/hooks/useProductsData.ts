import { useMemo } from "react";
import { useGetProductsQuery } from "@/Redux/Api/productsApi";
import { calculateProductStats } from "../utils/helpers";
import type { Product, ProductStats } from "../types";

export type ProductViewFilter = "all" | "active" | "inactive";

interface UseProductsDataOptions {
  view?: ProductViewFilter;
}

interface UseProductsDataReturn {
  products: Product[];
  stats: ProductStats;
  isLoading: boolean;
}

/**
 * Hook for fetching and managing product data.
 * view: "all" = fetch all (include_inactive true), "active" = active only, "inactive" = inactive only (fetch all then filter).
 */
export const useProductsData = (
  options: UseProductsDataOptions = {},
): UseProductsDataReturn => {
  const { view = "all" } = options;

  const includeInactive = view !== "active";
  const { data: rawProducts = [], isLoading } = useGetProductsQuery({
    include_inactive: includeInactive,
  });

  const products = useMemo(() => {
    if (view === "inactive") {
      return rawProducts.filter((p) => !p.is_active);
    }
    return rawProducts;
  }, [rawProducts, view]);

  const stats = useMemo(() => calculateProductStats(products), [products]);

  return {
    products,
    stats,
    isLoading,
  };
};
