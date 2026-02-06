/**
 * Format price with currency symbol
 */
export const formatPrice = (price: number): string => {
  return `₨${price}`;
};

/**
 * Format price for display with thousand separators
 */
export const formatPriceDetailed = (price: number): string => {
  return `₨${price.toLocaleString()}`;
};
