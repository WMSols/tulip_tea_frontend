import type {
  TeamWallet,
  WalletBalance,
  WalletStats,
  CollectFormData,
} from "../types";

/**
 * Calculate aggregated wallet statistics
 */
export const calculateWalletStats = (
  balance: WalletBalance | undefined,
  wallets: TeamWallet[],
): WalletStats => {
  const activeWallets = wallets.filter((w) => w.is_active).length;

  return {
    currentBalance: balance?.current_balance ?? 0,
    isActive: balance?.is_active ?? false,
    teamMembers: wallets.length,
    activeWallets,
    inactiveWallets: wallets.length - activeWallets,
    totalTeamBalance: wallets.reduce((sum, w) => sum + w.current_balance, 0),
    orderBookerCount: wallets.filter((w) => w.user_type === "order_booker")
      .length,
    deliveryManCount: wallets.filter((w) => w.user_type === "delivery_man")
      .length,
  };
};

/**
 * Get StatusBadge status variant for a user role
 */
export const getRoleStatus = (
  userType: string,
): "info" | "warning" | "success" | "neutral" => {
  if (userType === "order_booker") return "info";
  if (userType === "delivery_man") return "warning";
  if (userType === "distributor") return "success";
  return "neutral";
};

/**
 * Get human-readable label for a user role
 */
export const getRoleLabel = (userType: string): string => {
  if (userType === "order_booker") return "Order Booker";
  if (userType === "delivery_man") return "Delivery Man";
  if (userType === "distributor") return "Distributor";
  return userType;
};

/**
 * Get StatusBadge status variant for a transaction type
 */
export const getTxTypeStatus = (
  type: string,
): "success" | "danger" | "info" | "warning" | "neutral" => {
  switch (type) {
    case "transfer_in":
      return "success";
    case "transfer_out":
      return "danger";
    case "credit":
      return "info";
    case "debit":
      return "warning";
    default:
      return "neutral";
  }
};

/**
 * Get human-readable label for a transaction type
 */
export const getTxTypeLabel = (type: string): string => {
  switch (type) {
    case "transfer_in":
      return "Transfer In";
    case "transfer_out":
      return "Transfer Out";
    case "credit":
      return "Credit";
    case "debit":
      return "Debit";
    default:
      return type;
  }
};

/**
 * Check if a transaction type represents an incoming transaction
 */
export const isIncoming = (type: string): boolean => {
  return type === "transfer_in" || type === "credit";
};

/**
 * Validate collect form data
 */
export const validateCollectForm = (
  form: CollectFormData,
  maxBalance: number,
): { valid: boolean; error?: string } => {
  const amount = parseFloat(form.amount);

  if (!amount || Number.isNaN(amount)) {
    return { valid: false, error: "Please enter a valid amount" };
  }

  if (amount <= 0) {
    return { valid: false, error: "Amount must be greater than zero" };
  }

  if (amount > maxBalance) {
    return {
      valid: false,
      error: `Amount cannot exceed the available balance`,
    };
  }

  return { valid: true };
};
