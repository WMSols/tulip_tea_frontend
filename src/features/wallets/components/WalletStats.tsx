import {
  CircleDollarSign,
  Users,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "../utils/formatters";
import type { WalletStats as WalletStatsType } from "../types";

interface WalletStatsProps {
  stats: WalletStatsType;
  loading: boolean;
}

export default function WalletStats({ stats, loading }: WalletStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Current Balance"
        value={formatCurrency(stats.currentBalance)}
        icon={CircleDollarSign}
        iconColor="bg-primary/10 text-primary"
        change={stats.isActive ? "Wallet Active" : "Wallet Inactive"}
        changeType={stats.isActive ? "positive" : "negative"}
      />
      <StatCard
        title="Team Members"
        value={stats.teamMembers}
        icon={Users}
        iconColor="bg-info/10 text-info"
        change={`${stats.orderBookerCount} Order Bookers`}
        changeType="neutral"
      />
      <StatCard
        title="Active Wallets"
        value={stats.activeWallets}
        icon={CreditCard}
        iconColor="bg-success/10 text-success"
        change={`${stats.inactiveWallets} Inactive`}
        changeType="neutral"
      />
      <StatCard
        title="Team Balance"
        value={formatCurrency(stats.totalTeamBalance)}
        icon={TrendingUp}
        iconColor="bg-warning/10 text-warning"
        change="Total held by team"
        changeType="neutral"
      />
    </div>
  );
}
