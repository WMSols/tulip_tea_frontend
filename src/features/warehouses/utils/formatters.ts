/**
 * Format a date string to locale date string
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "—";

  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return "—";
  }
};

/**
 * Format a date string to locale date and time string
 */
export const formatDateTime = (
  dateString: string | null | undefined,
): string => {
  if (!dateString) return "—";

  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return "—";
  }
};

/**
 * Get display name for delivery man
 */
export const getDeliveryManName = (dm: {
  name?: string;
  full_name?: string;
  id: number;
}): string => {
  return dm.name ?? dm.full_name ?? `DeliveryMan #${dm.id}`;
};

/**
 * Get display name for product
 */
export const getProductName = (product: {
  name?: string;
  product_name?: string;
  id: number;
}): string => {
  return product.name ?? product.product_name ?? `Product #${product.id}`;
};
