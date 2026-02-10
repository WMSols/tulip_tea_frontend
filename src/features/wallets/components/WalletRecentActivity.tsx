import { Clock, Plus, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { formatCurrency } from "../utils/formatters";
import { isIncoming } from "../utils/helpers";
import type { WalletTransaction } from "../types";

interface WalletRecentActivityProps {
  transactions: WalletTransaction[];
  loading: boolean;
  onViewAll: () => void;
}

export default function WalletRecentActivity({
  transactions,
  loading,
  onViewAll,
}: WalletRecentActivityProps) {
  const recentActivity = transactions.slice(0, 3);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Recent Activity
        </h2>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : recentActivity.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <Clock className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {recentActivity.map((tx) => (
            <div key={tx.id} className="flex items-center gap-3 p-4">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                  isIncoming(tx.transaction_type)
                    ? "bg-success/10"
                    : "bg-destructive/10",
                )}
              >
                {isIncoming(tx.transaction_type) ? (
                  <Plus className="w-4 h-4 text-success" />
                ) : (
                  <Minus className="w-4 h-4 text-destructive" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-semibold text-sm",
                    isIncoming(tx.transaction_type)
                      ? "text-success"
                      : "text-destructive",
                  )}
                >
                  {formatCurrency(tx.amount)}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {tx.related_user_name
                    ? `from ${tx.related_user_name}`
                    : tx.description}
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {formatDistanceToNow(new Date(tx.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          ))}
          <button
            className="w-full py-3 text-sm font-medium text-primary hover:bg-accent/50 transition-colors rounded-b-xl"
            onClick={onViewAll}
          >
            View All Transactions &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
