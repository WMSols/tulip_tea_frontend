import { useState, useEffect, useCallback } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// --- Types ---
interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Subsidy {
  id: string | number;
  shop_name: string;
  order_booker_name: string;
  distributor_id: number;
  total_amount: number;
  calculated_total_amount: number;
  final_total_amount: number;
  original_amount: number;
  subsidy_status: "pending_approval" | "approved" | "rejected";
  subsidy_approved_by: string | null;
  subsidy_approved_at: string | null;
  subsidy_rejection_reason: string | null;
  order_items: OrderItem[];
  created_at: string;
}

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

// --- Mock Data ---
const MOCK_SUBSIDIES: Subsidy[] = [
  {
    id: 1001,
    shop_name: "Al-Rehman Tea House",
    order_booker_name: "Ahmed Khan",
    distributor_id: 1,
    total_amount: 5000,
    calculated_total_amount: 4500,
    final_total_amount: 4200,
    original_amount: 5000,
    subsidy_status: "pending_approval",
    subsidy_approved_by: null,
    subsidy_approved_at: null,
    subsidy_rejection_reason: null,
    order_items: [
      { product_name: "Tulip Green Tea 250g", quantity: 10, unit_price: 250, total_price: 2500 },
      { product_name: "Tulip Black Tea 500g", quantity: 5, unit_price: 500, total_price: 2500 },
    ],
    created_at: "2026-02-09T14:30:00.000000+00:00",
  },
  {
    id: 1002,
    shop_name: "Karachi Chai Point",
    order_booker_name: "Bilal Hussain",
    distributor_id: 1,
    total_amount: 3200,
    calculated_total_amount: 3000,
    final_total_amount: 2800,
    original_amount: 3200,
    subsidy_status: "approved",
    subsidy_approved_by: "faraz",
    subsidy_approved_at: "2026-02-08T10:00:00.000000+00:00",
    subsidy_rejection_reason: null,
    order_items: [
      { product_name: "Tulip Premium Blend 1kg", quantity: 2, unit_price: 1200, total_price: 2400 },
      { product_name: "Tulip Green Tea 250g", quantity: 4, unit_price: 200, total_price: 800 },
    ],
    created_at: "2026-02-07T09:15:00.000000+00:00",
  },
  {
    id: 1003,
    shop_name: "Lahore Tea Corner",
    order_booker_name: "Ob1",
    distributor_id: 1,
    total_amount: 7500,
    calculated_total_amount: 7000,
    final_total_amount: 6500,
    original_amount: 7500,
    subsidy_status: "rejected",
    subsidy_approved_by: "faraz",
    subsidy_approved_at: "2026-02-06T16:00:00.000000+00:00",
    subsidy_rejection_reason: "Subsidy amount exceeds the allowed threshold for this shop category.",
    order_items: [
      { product_name: "Tulip Black Tea 500g", quantity: 10, unit_price: 500, total_price: 5000 },
      { product_name: "Tulip Premium Blend 1kg", quantity: 2, unit_price: 1250, total_price: 2500 },
    ],
    created_at: "2026-02-05T11:45:00.000000+00:00",
  },
  {
    id: 1004,
    shop_name: "Islamabad Brew Stop",
    order_booker_name: "Farhan Ali",
    distributor_id: 1,
    total_amount: 2000,
    calculated_total_amount: 1800,
    final_total_amount: 1600,
    original_amount: 2000,
    subsidy_status: "pending_approval",
    subsidy_approved_by: null,
    subsidy_approved_at: null,
    subsidy_rejection_reason: null,
    order_items: [
      { product_name: "Tulip Green Tea 250g", quantity: 8, unit_price: 250, total_price: 2000 },
    ],
    created_at: "2026-02-10T08:00:00.000000+00:00",
  },
];

// --- Component ---
export default function Subsidy() {
  const { toast } = useToast();
  const [subsidies, setSubsidies] = useState<Subsidy[]>([]);
  const [loading, setLoading] = useState(true);

  // Detail modal
  const [selectedSubsidy, setSelectedSubsidy] = useState<Subsidy | null>(null);

  // Reject modal
  const [rejectTarget, setRejectTarget] = useState<Subsidy | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  // Approving state
  const [approvingId, setApprovingId] = useState<string | number | null>(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setSubsidies(MOCK_SUBSIDIES);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = async (subsidy: Subsidy) => {
    setApprovingId(subsidy.id);
    await new Promise((r) => setTimeout(r, 1000));
    setSubsidies((prev) =>
      prev.map((s) =>
        s.id === subsidy.id
          ? { ...s, subsidy_status: "approved" as const, subsidy_approved_by: "current_user", subsidy_approved_at: new Date().toISOString() }
          : s
      )
    );
    setApprovingId(null);
    toast({ title: "Subsidy Approved", description: `Order #${subsidy.id} subsidy has been approved.` });
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    if (!rejectionReason.trim()) {
      toast({ title: "Reason Required", description: "Please provide a rejection reason.", variant: "destructive" });
      return;
    }
    setRejecting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubsidies((prev) =>
      prev.map((s) =>
        s.id === rejectTarget.id
          ? { ...s, subsidy_status: "rejected" as const, subsidy_approved_by: "current_user", subsidy_approved_at: new Date().toISOString(), subsidy_rejection_reason: rejectionReason }
          : s
      )
    );
    setRejecting(false);
    setRejectTarget(null);
    setRejectionReason("");
    toast({ title: "Subsidy Rejected", description: `Order #${rejectTarget.id} subsidy has been rejected.` });
  };

  const columns = [
    {
      key: "id" as keyof Subsidy,
      label: "Order ID",
      sortable: true,
      render: (s: Subsidy) => <span className="font-medium text-foreground">#{s.id}</span>,
    },
    { key: "shop_name" as keyof Subsidy, label: "Shop Name", sortable: true },
    { key: "order_booker_name" as keyof Subsidy, label: "Order Booker", sortable: true },
    {
      key: "original_amount" as keyof Subsidy,
      label: "Original Amount",
      render: (s: Subsidy) => <span className="font-medium">{formatCurrency(s.original_amount)}</span>,
    },
    {
      key: "final_total_amount" as keyof Subsidy,
      label: "Final Amount",
      render: (s: Subsidy) => <span className="font-medium">{formatCurrency(s.final_total_amount)}</span>,
    },
    {
      key: "subsidy_diff" as string,
      label: "Subsidy Diff",
      render: (s: Subsidy) => {
        const diff = s.original_amount - s.final_total_amount;
        return <span className={cn("font-semibold", diff > 0 ? "text-success" : "text-muted-foreground")}>{formatCurrency(diff)}</span>;
      },
    },
    {
      key: "subsidy_status" as keyof Subsidy,
      label: "Status",
      render: (s: Subsidy) => subsidyStatusBadge(s.subsidy_status),
    },
    {
      key: "created_at" as keyof Subsidy,
      label: "Created",
      sortable: true,
      render: (s: Subsidy) => <span className="text-sm text-muted-foreground">{format(new Date(s.created_at), "MMM d, yyyy")}</span>,
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <BadgePercent className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{subsidies.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-warning/10">
              <BadgePercent className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{subsidies.filter((s) => s.subsidy_status === "pending_approval").length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-success/10">
              <Check className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{subsidies.filter((s) => s.subsidy_status === "approved").length}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-destructive/10">
              <X className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{subsidies.filter((s) => s.subsidy_status === "rejected").length}</p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
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
                    disabled={approvingId === s.id}
                    onClick={() => handleApprove(s)}
                    className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-2.5 text-xs"
                  >
                    {approvingId === s.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
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
                      {selectedSubsidy.order_items.map((item, i) => (
                        <tr key={i}>
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

      {/* ===== Reject Confirmation Modal ===== */}
      <Dialog open={!!rejectTarget} onOpenChange={() => { setRejectTarget(null); setRejectionReason(""); }}>
        <DialogContent className="bg-card border-border rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Reject Subsidy</DialogTitle>
            <DialogDescription>
              Reject subsidy for order #{rejectTarget?.id} — {rejectTarget?.shop_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection Reason <span className="text-destructive">*</span></Label>
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