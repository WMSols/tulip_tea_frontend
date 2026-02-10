/**
 * Format amount as Pakistani Rupee currency string
 */
export const formatCurrency = (amount: number): string => {
  return `Rs. ${amount.toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
