import { useMemo } from "react";
import { useAppSelector } from "@/Redux/Hooks/hooks";
import {
  useGetDistributorBalanceQuery,
  useGetAllWalletsQuery,
  useGetWalletTransactionsQuery,
} from "@/Redux/Api/walletsApi";
import { calculateWalletStats } from "../utils/helpers";
import { TX_QUERY_LIMIT } from "../utils/constants";
import type { WalletBalance, TeamWallet, WalletTransaction, WalletStats } from "../types";

interface UseWalletDataReturn {
  balance: WalletBalance | undefined;
  wallets: TeamWallet[];
  transactions: WalletTransaction[];
  stats: WalletStats;
  loading: {
    balance: boolean;
    wallets: boolean;
    transactions: boolean;
  };
  distributorId: number;
}

/**
 * Hook for fetching and managing all wallet-related data
 */
export const useWalletData = (): UseWalletDataReturn => {
  const distributorId = useAppSelector((s) => s.auth.user!.id);

  const { data: balance, isLoading: isLoadingBalance } =
    useGetDistributorBalanceQuery(distributorId);

  const { data: wallets = [], isLoading: isLoadingWallets } =
    useGetAllWalletsQuery(distributorId);

  const { data: transactions = [], isLoading: isLoadingTransactions } =
    useGetWalletTransactionsQuery(
      { distributorId, limit: TX_QUERY_LIMIT },
    );

  const stats = useMemo(
    () => calculateWalletStats(balance, wallets),
    [balance, wallets],
  );

  return {
    balance,
    wallets,
    transactions,
    stats,
    loading: {
      balance: isLoadingBalance,
      wallets: isLoadingWallets,
      transactions: isLoadingTransactions,
    },
    distributorId,
  };
};
