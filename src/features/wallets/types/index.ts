import type {
  WalletBalance,
  TeamWallet,
  WalletTransaction,
  CollectionTrail,
  CollectRequest,
} from "@/types/wallet";

// Re-export base types
export type {
  WalletBalance,
  TeamWallet,
  WalletTransaction,
  CollectionTrail,
  CollectRequest,
};

// UI-specific types
export interface WalletStats {
  currentBalance: number;
  isActive: boolean;
  teamMembers: number;
  activeWallets: number;
  inactiveWallets: number;
  totalTeamBalance: number;
  orderBookerCount: number;
  deliveryManCount: number;
}

export interface CollectFormData {
  amount: string;
  description: string;
}

export type WalletRow = TeamWallet & { id: number };

export type TransactionTypeFilter =
  | "all"
  | "transfer_in"
  | "transfer_out"
  | "credit"
  | "debit";

export type RoleFilter = "all" | "order_booker" | "delivery_man";
