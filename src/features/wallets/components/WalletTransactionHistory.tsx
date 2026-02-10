import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  X,
  Eye,
  Receipt,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { formatCurrency } from "../utils/formatters";
import {
  getRoleStatus,
  getRoleLabel,
  getTxTypeStatus,
  getTxTypeLabel,
  isIncoming,
} from "../utils/helpers";
import type { TeamWallet, WalletTransaction } from "../types";

interface WalletTransactionHistoryProps {
  transactions: WalletTransaction[];
  wallets: TeamWallet[];
  loading: boolean;
  onSelectTransaction: (tx: WalletTransaction) => void;
}

export default function WalletTransactionHistory({
  transactions,
  wallets,
  loading,
  onSelectTransaction,
}: WalletTransactionHistoryProps) {
  const [txTypeFilter, setTxTypeFilter] = useState("all");
  const [txUserFilter, setTxUserFilter] = useState("all");
  const [txDateFrom, setTxDateFrom] = useState("");
  const [txDateTo, setTxDateTo] = useState("");

  const filteredTransactions = transactions.filter((tx) => {
    if (txTypeFilter !== "all" && tx.transaction_type !== txTypeFilter)
      return false;
    if (txUserFilter !== "all") {
      const key = `${tx.related_user_id}-${tx.related_user_type}`;
      if (key !== txUserFilter) return false;
    }
    if (txDateFrom && new Date(tx.created_at) < new Date(txDateFrom))
      return false;
    if (txDateTo) {
      const to = new Date(txDateTo);
      to.setHours(23, 59, 59);
      if (new Date(tx.created_at) > to) return false;
    }
    return true;
  });

  const clearFilters = () => {
    setTxTypeFilter("all");
    setTxUserFilter("all");
    setTxDateFrom("");
    setTxDateTo("");
  };

  const columns = [
    {
      key: "created_at",
      label: "Date",
      render: (tx: WalletTransaction) => (
        <span className="text-sm whitespace-nowrap">
          {format(new Date(tx.created_at), "MMM d, yyyy h:mm a")}
        </span>
      ),
    },
    {
      key: "transaction_type",
      label: "Type",
      render: (tx: WalletTransaction) => (
        <StatusBadge
          status={getTxTypeStatus(tx.transaction_type)}
          label={getTxTypeLabel(tx.transaction_type)}
        />
      ),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (tx: WalletTransaction) => (
        <span
          className={cn(
            "font-semibold",
            isIncoming(tx.transaction_type)
              ? "text-success"
              : "text-destructive",
          )}
        >
          {isIncoming(tx.transaction_type) ? "+" : "-"}
          {formatCurrency(tx.amount)}
        </span>
      ),
    },
    {
      key: "balance_change",
      label: "Balance Change",
      render: (tx: WalletTransaction) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatCurrency(tx.balance_before)} &rarr;{" "}
          {formatCurrency(tx.balance_after)}
        </span>
      ),
    },
    {
      key: "related_user_name",
      label: "From / To",
      render: (tx: WalletTransaction) =>
        tx.related_user_name ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">{tx.related_user_name}</span>
            {tx.related_user_type && (
              <StatusBadge
                status={getRoleStatus(tx.related_user_type)}
                label={getRoleLabel(tx.related_user_type)}
              />
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">&mdash;</span>
        ),
    },
    {
      key: "shop_name",
      label: "Shop",
      render: (tx: WalletTransaction) =>
        tx.shop_name ? (
          <span className="flex items-center gap-1.5 text-sm">
            <Store className="w-3.5 h-3.5 text-muted-foreground" />
            {tx.shop_name}
          </span>
        ) : (
          <span className="text-muted-foreground">&mdash;</span>
        ),
    },
    {
      key: "details",
      label: "Details",
      className: "w-24",
      render: (tx: WalletTransaction) => (
        <Button
          size="sm"
          variant="ghost"
          className="gap-1 text-xs edit-btn-hover"
          onClick={(e) => {
            e.stopPropagation();
            onSelectTransaction(tx);
          }}
        >
          <Eye className="w-3.5 h-3.5" /> View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      {/* <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">From</Label>
            <Input
              type="date"
              value={txDateFrom}
              onChange={(e) => setTxDateFrom(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">To</Label>
            <Input
              type="date"
              value={txDateTo}
              onChange={(e) => setTxDateTo(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Type</Label>
            <Select value={txTypeFilter} onValueChange={setTxTypeFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="transfer_in">Transfer In</SelectItem>
                <SelectItem value="transfer_out">Transfer Out</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">User</Label>
            <Select value={txUserFilter} onValueChange={setTxUserFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {wallets.map((w) => (
                  <SelectItem
                    key={w.wallet_id}
                    value={`${w.user_id}-${w.user_type}`}
                  >
                    {w.user_name} ({w.user_type.replace("_", " ")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-xs gap-1"
            >
              <X className="w-3 h-3" /> Clear
            </Button>
          </div>
        </div>
      </div> */}

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Receipt className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No transactions found
          </p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden lg:block">
            <DataTable data={filteredTransactions} columns={columns} />
          </div>

          {/* Mobile */}
          <div className="lg:hidden space-y-3">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="mobile-card cursor-pointer"
                onClick={() => onSelectTransaction(tx)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        isIncoming(tx.transaction_type)
                          ? "bg-success/10"
                          : "bg-destructive/10",
                      )}
                    >
                      {isIncoming(tx.transaction_type) ? (
                        <ArrowDownLeft className="w-4 h-4 text-success" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p
                        className={cn(
                          "font-semibold text-sm",
                          isIncoming(tx.transaction_type)
                            ? "text-success"
                            : "text-destructive",
                        )}
                      >
                        {isIncoming(tx.transaction_type) ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(
                          new Date(tx.created_at),
                          "MMM d, yyyy h:mm a",
                        )}
                      </p>
                    </div>
                  </div>
                  <StatusBadge
                    status={getTxTypeStatus(tx.transaction_type)}
                    label={getTxTypeLabel(tx.transaction_type)}
                  />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    {tx.related_user_name
                      ? `${isIncoming(tx.transaction_type) ? "From" : "To"}: ${tx.related_user_name}`
                      : tx.description}
                  </div>
                  {tx.shop_name && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Store className="w-3 h-3" />
                      {tx.shop_name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
