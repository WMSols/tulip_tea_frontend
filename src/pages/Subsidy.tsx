import { useState } from "react";
import {
  BadgePercent,
  Eye,
  Check,
  X,
  Loader2,
  Store,
  Coins,
  Package,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { StatCardSkeleton } from "@/components/dashboard/StatCardSkeleton";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/Redux/Hooks/hooks";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { PendingSubsidyOrderDto } from "@/types/subsidy";
import {
  useGetPendingSubsidyApprovalQuery,
  useApproveSubsidyMutation,
  useRejectSubsidyMutation,
} from "@/Redux/Api/ordersSubsidyApi";

// --- Helpers ---
function formatCurrency(amount: number) {
  return `Rs. ${amount.toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function subsidyStatusBadge(status: string) {
  switch (status) {
    case "pending_approval":
      return <StatusBadge status="warning" label="Pending Approval" />;
    case "approved":
      return <StatusBadge status="success" label="Approved" />;
    case "rejected":
      return <StatusBadge status="danger" label="Rejected" />;
    default:
      return <StatusBadge status="neutral" label={status} />;
  }
}

// --- Component ---
export default function Subsidy() {
  const { toast } = useToast();
  const headerRefreshing = useAppSelector((s) => s.ui.headerRefreshing);
  const { data: subsidies = [], isLoading } = useGetPendingSubsidyApprovalQuery();
  const [approveSubsidy, { isLoading: approving }] = useApproveSubsidyMutation();
  const [rejectSubsidy, { isLoading: rejecting }] = useRejectSubsidyMutation();

  // Detail modal
  const [selectedSubsidy, setSelectedSubsidy] = useState<PendingSubsidyOrderDto | null>(null);

  // Approve confirmation
  const [approveTarget, setApproveTarget] = useState<PendingSubsidyOrderDto | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);

  // Reject modal
  const [rejectTarget, setRejectTarget] = useState<PendingSubsidyOrderDto | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleConfirmApprove = async () => {
    if (!approveTarget) return;
    const order = approveTarget;
    setApprovingId(order.id);
    try {
      await approveSubsidy(order.id).unwrap();
      setApproveTarget(null);
      toast({ title: "Subsidy Approved", description: `Order #${order.id} subsidy has been approved.` });
    } catch {
      toast({ title: "Error", description: "Failed to approve subsidy.", variant: "destructive" });
    } finally {
      setApprovingId(null);
    }
  };

  const handleApproveClick = (order: PendingSubsidyOrderDto) => {
    setApproveTarget(order);
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    if (!rejectionReason.trim()) {
      toast({ title: "Reason Required", description: "Please provide a rejection reason.", variant: "destructive" });
      return;
    }
    try {
      await rejectSubsidy({
        orderId: rejectTarget.id,
        body: { subsidy_rejection_reason: rejectionReason },
      }).unwrap();
      setRejectTarget(null);
      setRejectionReason("");
      toast({ title: "Subsidy Rejected", description: `Order #${rejectTarget.id} subsidy has been rejected.` });
    } catch {
      toast({ title: "Error", description: "Failed to reject subsidy.", variant: "destructive" });
    }
  };

  const columns = [
    {
      key: "id" as keyof PendingSubsidyOrderDto,
      label: "Order ID",
      sortable: true,
      render: (s: PendingSubsidyOrderDto) => <span className="font-medium text-foreground">#{s.id}</span>,
    },
    { key: "shop_name" as keyof PendingSubsidyOrderDto, label: "Shop Name", sortable: true },
    { key: "order_booker_name" as keyof PendingSubsidyOrderDto, label: "Order Booker", sortable: true },
    {
      key: "original_amount" as keyof PendingSubsidyOrderDto,
      label: "Original Amount",
      render: (s: PendingSubsidyOrderDto) => <span className="font-medium">{formatCurrency(s.original_amount)}</span>,
    },
    {
      key: "final_total_amount" as keyof PendingSubsidyOrderDto,
      label: "Final Amount",
      render: (s: PendingSubsidyOrderDto) => <span className="font-medium">{formatCurrency(s.final_total_amount)}</span>,
    },
    {
      key: "subsidy_diff" as string,
      label: "Subsidy Diff",
      render: (s: PendingSubsidyOrderDto) => {
        const diff = s.original_amount - s.final_total_amount;
        return <span className={cn("font-semibold", diff > 0 ? "text-success" : "text-muted-foreground")}>{formatCurrency(diff)}</span>;
      },
    },
    {
      key: "subsidy_status" as keyof PendingSubsidyOrderDto,
      label: "Status",
      render: (s: PendingSubsidyOrderDto) => subsidyStatusBadge(s.subsidy_status),
    },
    {
      key: "created_at" as keyof PendingSubsidyOrderDto,
      label: "Created",
      sortable: true,
      render: (s: PendingSubsidyOrderDto) => <span className="text-sm text-muted-foreground">{format(new Date(s.created_at), "MMM d, yyyy")}</span>,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <BadgePercent className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Subsidy Management</h1>
            <p className="text-sm text-muted-foreground">Review and manage order subsidies</p>
          </div>
        </div>
      </div>

      {/* Stats — derived from pending subsidy orders */}
      {(isLoading || headerRefreshing) ? (
        <StatCardSkeleton count={4} columns={4} />
      ) : (
        (() => {
          const totalSubsidyValue = subsidies.reduce(
            (sum, s) => sum + (s.original_amount - s.final_total_amount),
            0
          );
          const shopsAffected = new Set(subsidies.map((s) => s.shop_id)).size;
          const avgSubsidyPerOrder =
            subsidies.length > 0 ? totalSubsidyValue / subsidies.length : 0;
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="stat-card">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-warning/10">
                    <BadgePercent className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{subsidies.length}</p>
                    <p className="text-sm text-muted-foreground">Pending approval</p>
                    <p className="text-xs text-muted-foreground/80 mt-0.5">
                      Orders awaiting your decision
                    </p>
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    <Coins className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {formatCurrency(totalSubsidyValue)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total subsidy value
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-0.5">
                      Discount across all pending
                    </p>
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-muted">
                    <Store className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{shopsAffected}</p>
                    <p className="text-sm text-muted-foreground">
                      Shops affected
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-0.5">
                      Unique shops in pending orders
                    </p>
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-success/10">
                    <Coins className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {formatCurrency(avgSubsidyPerOrder)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Avg. subsidy per order
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-0.5">
                      Per order
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()
      )}

      {/* Table */}
      {(isLoading || headerRefreshing) ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <DataTable
          data={subsidies}
          columns={columns}
          actions={(s) => (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedSubsidy(s)}
                className="edit-btn-hover text-muted-foreground"
              >
                <Eye className="w-4 h-4" />
              </Button>
              {s.subsidy_status === "pending_approval" && (
                <>
                  <Button
                    size="sm"
                    disabled={approvingId === s.id || approving}
                    onClick={() => handleApproveClick(s)}
                    className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-2.5 text-xs"
                  >
                    {approvingId === s.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin"
                    />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setRejectTarget(s); setRejectionReason(""); }}
                    className="gap-1 border-destructive/30 text-destructive hover:bg-destructive/10 h-8 px-2.5 text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          )}
          
        />
      )}

      {/* ===== Detail Modal ===== */}
      <Dialog open={!!selectedSubsidy} onOpenChange={() => setSelectedSubsidy(null)}>
        <DialogContent className="bg-card border-border rounded-xl sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Subsidy Details — #{selectedSubsidy?.id}</DialogTitle>
            <DialogDescription>Full breakdown of this subsidy order</DialogDescription>
          </DialogHeader>
          {selectedSubsidy && (
            <div className="space-y-5 py-2">
              {/* Basic Info */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Store className="w-4 h-4 text-primary" /> Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Order ID:</span> <span className="font-medium ml-1">#{selectedSubsidy.id}</span></div>
                  <div><span className="text-muted-foreground">Shop:</span> <span className="font-medium ml-1">{selectedSubsidy.shop_name}</span></div>
                  <div><span className="text-muted-foreground">Order Booker:</span> <span className="font-medium ml-1">{selectedSubsidy.order_booker_name}</span></div>
                  <div><span className="text-muted-foreground">Distributor ID:</span> <span className="font-medium ml-1">{selectedSubsidy.distributor_id}</span></div>
                  <div><span className="text-muted-foreground">Created:</span> <span className="font-medium ml-1">{format(new Date(selectedSubsidy.created_at), "MMM d, yyyy h:mm a")}</span></div>
                  <div><span className="text-muted-foreground">Status:</span> <span className="ml-1">{subsidyStatusBadge(selectedSubsidy.subsidy_status)}</span></div>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Coins className="w-4 h-4 text-primary" /> Amount Breakdown</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between sm:block">
                    <span className="text-muted-foreground">Original Amount</span>
                    <span className="font-medium sm:block">{formatCurrency(selectedSubsidy.original_amount)}</span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="text-muted-foreground">Calculated Total</span>
                    <span className="font-medium sm:block">{formatCurrency(selectedSubsidy.calculated_total_amount)}</span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="text-muted-foreground">Final Total</span>
                    <span className="font-medium sm:block">{formatCurrency(selectedSubsidy.final_total_amount)}</span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="text-muted-foreground">Subsidy Difference</span>
                    <span className="font-semibold text-success sm:block">{formatCurrency(selectedSubsidy.original_amount - selectedSubsidy.final_total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Package className="w-4 h-4 text-primary" /> Order Items</h3>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSubsidy.order_items.map((item) => (
                        <tr key={item.id}>
                          <td className="font-medium">{item.product_name}</td>
                          <td>{item.quantity}</td>
                          <td>{formatCurrency(item.unit_price)}</td>
                          <td className="font-medium">{formatCurrency(item.total_price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Approval Info */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><ClipboardCheck className="w-4 h-4 text-primary" /> Approval Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Status:</span> <span className="ml-1">{subsidyStatusBadge(selectedSubsidy.subsidy_status)}</span></div>
                  {selectedSubsidy.subsidy_approved_by && (
                    <div><span className="text-muted-foreground">Approved By:</span> <span className="font-medium ml-1">{selectedSubsidy.subsidy_approved_by}</span></div>
                  )}
                  {selectedSubsidy.subsidy_approved_at && (
                    <div><span className="text-muted-foreground">Approved At:</span> <span className="font-medium ml-1">{format(new Date(selectedSubsidy.subsidy_approved_at), "MMM d, yyyy h:mm a")}</span></div>
                  )}
                  {selectedSubsidy.subsidy_rejection_reason && (
                    <div className="sm:col-span-2">
                      <span className="text-muted-foreground">Rejection Reason:</span>
                      <p className="mt-1 text-sm font-medium text-destructive bg-destructive/5 rounded-lg p-2.5 border border-destructive/10">
                        {selectedSubsidy.subsidy_rejection_reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedSubsidy(null)} className="rounded-lg">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Approve Confirmation Modal ===== */}
      <Dialog open={!!approveTarget} onOpenChange={() => setApproveTarget(null)}>
        <DialogContent className="bg-card border-border rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Approve subsidy</DialogTitle>
            <DialogDescription>
              Approve subsidy for order #{approveTarget?.id} — {approveTarget?.shop_name}. Final amount: {approveTarget && formatCurrency(approveTarget.final_total_amount)}.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">This action cannot be undone. Do you want to continue?</p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setApproveTarget(null)} className="rounded-lg">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmApprove}
              disabled={approving}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg gap-2"
            >
              {approving && <Loader2 className="w-4 h-4 animate-spin" />}
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Reject Confirmation Modal ===== */}
      <Dialog open={!!rejectTarget} onOpenChange={() => { setRejectTarget(null); setRejectionReason(""); }}>
        <DialogContent className="bg-card border-border rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Reject subsidy</DialogTitle>
            <DialogDescription>
              Reject subsidy for order #{rejectTarget?.id} — {rejectTarget?.shop_name}. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection reason <span className="text-destructive">*</span></Label>
              <Textarea
                id="rejection-reason"
                placeholder="Provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="bg-background border-border min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setRejectTarget(null); setRejectionReason(""); }} className="rounded-lg">
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={rejecting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg gap-2"
            >
              {rejecting && <Loader2 className="w-4 h-4 animate-spin" />}
              Reject Subsidy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}