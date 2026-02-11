import { useState } from "react";
import { Wallet as WalletIcon, Receipt } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Feature hooks
import { useWalletData } from "@/features/wallets/hooks/useWalletData";
import { useWalletActions } from "@/features/wallets/hooks/useWalletActions";
import { useCollectDialog } from "@/features/wallets/hooks/useCollectDialog";

// Feature components
import WalletHeader from "@/features/wallets/components/WalletHeader";
import WalletStats from "@/features/wallets/components/WalletStats";
import WalletTeamTable from "@/features/wallets/components/WalletTeamTable";
import WalletRecentActivity from "@/features/wallets/components/WalletRecentActivity";
import WalletTransactionHistory from "@/features/wallets/components/WalletTransactionHistory";
import CollectMoneyDialog from "@/features/wallets/components/CollectMoneyDialog";
import TransactionDetailDialog from "@/features/wallets/components/TransactionDetailDialog";
import { PageSkeleton } from "@/components/dashboard/PageSkeleton";

import type { WalletTransaction } from "@/features/wallets/types";

export default function Wallet() {
  const [activeTab, setActiveTab] = useState("overview");

  // Data
  const { wallets, transactions, stats, loading } = useWalletData();

  // Combined loading: wait for all wallet data before showing page
  const isPageLoading = loading.balance || loading.wallets || loading.transactions;

  // Collect action
  const { handleCollect, isCollecting } = useWalletActions();

  // Collect dialog state
  const {
    collectTarget,
    formData,
    setFormData,
    openCollectDialog,
    closeCollectDialog,
  } = useCollectDialog();

  // Transaction detail modal
  const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null);

  // Collect handler bridging dialog + action hooks
  const onCollect = async () => {
    if (!collectTarget) return;
    const success = await handleCollect(collectTarget, formData);
    if (success) closeCollectDialog();
  };

  if (isPageLoading) {
    return (
      <PageSkeleton
        statCards={4}
        statColumns={4}
        tableColumns={5}
        tableRows={6}
        showHeader
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <WalletHeader />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger
            value="overview"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm px-5 py-2 text-sm gap-2"
          >
            <WalletIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Wallet Overview</span>
            <span className="sm:hidden">Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm px-5 py-2 text-sm gap-2"
          >
            <Receipt className="w-4 h-4" />
            <span className="hidden sm:inline">Transaction History</span>
            <span className="sm:hidden">History</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <WalletStats stats={stats} loading={false} />
          <WalletTeamTable
            wallets={wallets}
            loading={false}
            onCollect={openCollectDialog}
          />
          <WalletRecentActivity
            transactions={transactions}
            loading={false}
            onViewAll={() => setActiveTab("history")}
          />
        </TabsContent>

        {/* Transaction History Tab */}
        <TabsContent value="history" className="space-y-6 mt-6">
          <WalletTransactionHistory
            transactions={transactions}
            wallets={wallets}
            loading={false}
            onSelectTransaction={setSelectedTx}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CollectMoneyDialog
        collectTarget={collectTarget}
        formData={formData}
        isCollecting={isCollecting}
        onFormChange={setFormData}
        onCollect={onCollect}
        onClose={closeCollectDialog}
      />

      <TransactionDetailDialog
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
}
