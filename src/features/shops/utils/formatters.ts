/**
 * Formats a currency value with Pakistani Rupee symbol
 */
export function formatCurrency(amount: number): string {
  return `₨${amount.toLocaleString()}`;
}

/**
 * Formats currency in thousands (K format)
 */
export function formatCurrencyCompact(amount: number): string {
  return `₨${(amount / 1000).toFixed(0)}K`;
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
