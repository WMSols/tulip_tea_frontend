import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import type { WalletTransaction } from "../types";

interface TransactionDetailDialogProps {
  transaction: WalletTransaction | null;
  onClose: () => void;
}

export default function TransactionDetailDialog({
  transaction,
  onClose,
}: TransactionDetailDialogProps) {
  return (
    <Dialog
      open={!!transaction}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="bg-card border-border rounded-xl sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Full details for transaction #{transaction?.id}
          </DialogDescription>
        </DialogHeader>

        {transaction && (
          <div className="space-y-5 py-2">
            {/* Transaction Info */}
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Transaction Information
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-medium">#{transaction.id}</span>
                <span className="text-muted-foreground">Type</span>
                <span>
                  <StatusBadge
                    status={getTxTypeStatus(transaction.transaction_type)}
                    label={getTxTypeLabel(transaction.transaction_type)}
                  />
                </span>
                <span className="text-muted-foreground">Amount</span>
                <span
                  className={cn(
                    "font-semibold",
                    isIncoming(transaction.transaction_type)
                      ? "text-success"
                      : "text-destructive",
                  )}
                >
                  {formatCurrency(transaction.amount)}
                </span>
                <span className="text-muted-foreground">Balance Before</span>
                <span>{formatCurrency(transaction.balance_before)}</span>
                <span className="text-muted-foreground">Balance After</span>
                <span>{formatCurrency(transaction.balance_after)}</span>
                <span className="text-muted-foreground">Description</span>
                <span>{transaction.description}</span>
                <span className="text-muted-foreground">Date</span>
                <span>
                  {format(
                    new Date(transaction.created_at),
                    "MMM d, yyyy h:mm a",
                  )}
                </span>
                <span className="text-muted-foreground">Reference</span>
                <span>
                  {transaction.reference_type} #{transaction.reference_id}
                </span>
              </div>
            </div>

            {/* Transfer Details */}
            {transaction.related_user_name && (
              <div className="space-y-1 border-t border-border pt-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Transfer Details
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <span className="text-muted-foreground">Direction</span>
                  <span>
                    {isIncoming(transaction.transaction_type)
                      ? "Received from"
                      : "Sent to"}
                  </span>
                  <span className="text-muted-foreground">User</span>
                  <span className="flex items-center gap-2">
                    {transaction.related_user_name}{" "}
                    {transaction.related_user_type && (
                      <StatusBadge
                        status={getRoleStatus(transaction.related_user_type)}
                        label={getRoleLabel(transaction.related_user_type)}
                      />
                    )}
                  </span>
                  {transaction.initiated_by_name && (
                    <>
                      <span className="text-muted-foreground">
                        Initiated By
                      </span>
                      <span>
                        {transaction.initiated_by_name} (
                        {transaction.initiated_by_type})
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Collection Trail */}
            {transaction.collection_trails &&
              transaction.collection_trails.length > 0 && (
                <div className="space-y-2 border-t border-border pt-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    Collection Trail ({transaction.trail_count} collection
                    {transaction.trail_count !== 1 ? "s" : ""})
                  </h3>
                  {transaction.collection_trails.map((trail) => (
                    <div
                      key={trail.transaction_id}
                      className="bg-muted/30 rounded-lg p-3 space-y-1 text-sm"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-muted-foreground" />
                          {trail.shop_name}
                        </span>
                        <StatusBadge
                          status={
                            trail.status === "pending"
                              ? "warning"
                              : trail.status === "completed"
                                ? "success"
                                : "neutral"
                          }
                          label={trail.status}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Owner: {trail.shop_owner}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>Route: {trail.route_name}</span>
                        <span>Zone: {trail.zone_name}</span>
                      </div>
                      <div className="flex justify-between text-xs pt-1">
                        <span className="font-semibold text-foreground">
                          {formatCurrency(trail.collection_amount)}
                        </span>
                        <span className="text-muted-foreground">
                          {format(
                            new Date(trail.collection_date),
                            "MMM d, yyyy",
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            {/* Metadata */}
            {transaction.metadata &&
              Object.keys(transaction.metadata).length > 0 && (
                <div className="space-y-2 border-t border-border pt-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    Metadata
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-3 space-y-1 text-xs">
                    {Object.entries(transaction.metadata).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="font-medium text-foreground">
                            {String(value)}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
