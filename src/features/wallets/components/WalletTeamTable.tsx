import { useState } from "react";
import { Wallet as WalletIcon, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DataTable } from "@/components/dashboard/DataTable";
import { cn } from "@/lib/utils";
import { formatCurrency } from "../utils/formatters";
import { getRoleStatus, getRoleLabel } from "../utils/helpers";
import { ROLE_FILTER_OPTIONS } from "../utils/constants";
import type { TeamWallet, WalletRow } from "../types";

interface WalletTeamTableProps {
  wallets: TeamWallet[];
  loading: boolean;
  onCollect: (wallet: TeamWallet) => void;
}

export default function WalletTeamTable({
  wallets,
  loading,
  onCollect,
}: WalletTeamTableProps) {
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredWallets = wallets
    .filter((w) => roleFilter === "all" || w.user_type === roleFilter)
    .sort((a, b) => b.current_balance - a.current_balance);

  const walletTableData: WalletRow[] = filteredWallets.map((w) => ({
    ...w,
    id: w.wallet_id,
  }));

  const columns = [
    {
      key: "user_name",
      label: "User",
      render: (w: WalletRow) => (
        <div>
          <p className="font-medium text-foreground">{w.user_name}</p>
          <p className="text-xs text-muted-foreground">{w.user_phone}</p>
        </div>
      ),
    },
    {
      key: "user_type",
      label: "Role",
      render: (w: WalletRow) => (
        <StatusBadge
          status={getRoleStatus(w.user_type)}
          label={getRoleLabel(w.user_type)}
        />
      ),
    },
    {
      key: "current_balance",
      label: "Balance",
      sortable: true,
      render: (w: WalletRow) => (
        <span
          className={cn(
            "font-semibold",
            w.current_balance > 0 ? "text-success" : "text-muted-foreground",
          )}
        >
          {formatCurrency(w.current_balance)}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (w: WalletRow) => (
        <StatusBadge
          status={w.is_active ? "success" : "danger"}
          label={w.is_active ? "Active" : "Inactive"}
        />
      ),
    },
    {
      key: "action",
      label: "Action",
      className: "w-32",
      render: (w: WalletRow) => (
        <Button
          size="sm"
          disabled={w.current_balance <= 0}
          onClick={() => onCollect(w)}
          className="gap-1.5"
        >
          <Banknote className="w-4 h-4" />
          Collect
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Team Wallets
          </h2>
          <p className="text-sm text-muted-foreground">
            Collect money from your order bookers and delivery men
          </p>
        </div>
        <div className="flex gap-1 bg-muted/40 p-1 rounded-lg">
          {ROLE_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRoleFilter(opt.value)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                roleFilter === opt.value
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredWallets.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <WalletIcon className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No wallets found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <DataTable data={walletTableData} columns={columns} />
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {filteredWallets.map((w) => (
              <div key={w.wallet_id} className="mobile-card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{w.user_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {w.user_phone}
                    </p>
                  </div>
                  <StatusBadge
                    status={getRoleStatus(w.user_type)}
                    label={getRoleLabel(w.user_type)}
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Balance</p>
                    <p
                      className={cn(
                        "font-semibold",
                        w.current_balance > 0
                          ? "text-success"
                          : "text-muted-foreground",
                      )}
                    >
                      {formatCurrency(w.current_balance)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge
                      status={w.is_active ? "success" : "danger"}
                      label={w.is_active ? "Active" : "Inactive"}
                    />
                    <Button
                      size="sm"
                      disabled={w.current_balance <= 0}
                      onClick={() => onCollect(w)}
                      className="gap-1.5"
                    >
                      <Banknote className="w-3.5 h-3.5" />
                      Collect
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
