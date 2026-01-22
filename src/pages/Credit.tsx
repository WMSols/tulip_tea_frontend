import { useState } from "react";
import { CheckCircle, XCircle, CreditCard, TrendingUp, AlertCircle, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface CreditRequest {
  id: string;
  shopId: string;
  shopName: string;
  ownerName: string;
  zone: string;
  currentLimit: number;
  requestedLimit: number;
  currentBalance: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  remarks?: string;
  requestedAt: string;
}

const initialRequests: CreditRequest[] = [
  { id: "CR001", shopId: "SH001", shopName: "Karachi Tea Emporium", ownerName: "Muhammad Tariq", zone: "Zone A", currentLimit: 50000, requestedLimit: 75000, currentBalance: 12500, reason: "Business expansion, adding more tea varieties", status: "pending", requestedAt: "2024-01-28" },
  { id: "CR002", shopId: "SH002", shopName: "Ali's Tea House", ownerName: "Ali Raza", zone: "Zone B", currentLimit: 30000, requestedLimit: 50000, currentBalance: 8000, reason: "Peak season approaching, need more stock", status: "pending", requestedAt: "2024-01-27" },
  { id: "CR003", shopId: "SH003", shopName: "Green Leaf Store", ownerName: "Hamza Khan", zone: "Zone A", currentLimit: 40000, requestedLimit: 60000, currentBalance: 0, reason: "Good payment history, want higher limit", status: "approved", remarks: "Excellent track record", requestedAt: "2024-01-25" },
  { id: "CR004", shopId: "SH006", shopName: "Sunrise Tea Shop", ownerName: "Waseem Abbas", zone: "Zone D", currentLimit: 25000, requestedLimit: 40000, currentBalance: 15000, reason: "Opening second outlet", status: "rejected", remarks: "High outstanding balance", requestedAt: "2024-01-24" },
];

export default function Credit() {
  const [requests, setRequests] = useState<CreditRequest[]>(initialRequests);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CreditRequest | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [remarks, setRemarks] = useState("");
  const { toast } = useToast();

  const handleAction = (request: CreditRequest, type: "approve" | "reject") => {
    setSelectedRequest(request);
    setActionType(type);
    setRemarks("");
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (selectedRequest) {
      setRequests(requests.map(r => 
        r.id === selectedRequest.id 
          ? { ...r, status: actionType === "approve" ? "approved" as const : "rejected" as const, remarks }
          : r
      ));
      toast({ 
        title: actionType === "approve" ? "Credit Approved" : "Credit Rejected",
        description: `Credit request has been ${actionType === "approve" ? "approved" : "rejected"}.`,
        variant: actionType === "approve" ? "default" : "destructive"
      });
      setIsDialogOpen(false);
    }
  };

  const filteredRequests = activeTab === "all" 
    ? requests 
    : requests.filter(r => r.status === activeTab);

  const pendingCount = requests.filter(r => r.status === "pending").length;
  const totalPendingAmount = requests.filter(r => r.status === "pending").reduce((acc, r) => acc + (r.requestedLimit - r.currentLimit), 0);
  const totalApprovedAmount = requests.filter(r => r.status === "approved").reduce((acc, r) => acc + (r.requestedLimit - r.currentLimit), 0);

  const columns = [
    { key: "shopName", label: "Shop", sortable: true },
    { key: "ownerName", label: "Owner", className: "hidden md:table-cell" },
    { 
      key: "zone", 
      label: "Zone",
      render: (req: CreditRequest) => (
        <StatusBadge status="info" label={req.zone} />
      )
    },
    { 
      key: "currentLimit", 
      label: "Current",
      render: (req: CreditRequest) => (
        <span className="font-medium">₨{req.currentLimit.toLocaleString()}</span>
      )
    },
    { 
      key: "requestedLimit", 
      label: "Requested",
      render: (req: CreditRequest) => (
        <span className="font-medium text-primary">₨{req.requestedLimit.toLocaleString()}</span>
      )
    },
    { 
      key: "currentBalance", 
      label: "Balance",
      render: (req: CreditRequest) => (
        <span className={req.currentBalance > 0 ? "text-destructive" : "text-success"}>
          ₨{req.currentBalance.toLocaleString()}
        </span>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (req: CreditRequest) => (
        <StatusBadge 
          status={
            req.status === "approved" ? "success" 
            : req.status === "pending" ? "warning" 
            : "danger"
          } 
          label={req.status.charAt(0).toUpperCase() + req.status.slice(1)} 
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Credit Management</h1>
          <p className="text-muted-foreground">Review and manage shop credit requests</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <AlertCircle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold">₨{(totalPendingAmount / 1000).toFixed(0)}K</p>
              <p className="text-sm text-muted-foreground">Pending Amount</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold">₨{(totalApprovedAmount / 1000).toFixed(0)}K</p>
              <p className="text-sm text-muted-foreground">Approved (MTD)</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Store className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold">{requests.filter(r => r.status === "approved").length}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all" className="data-[state=active]:bg-card">All</TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-card">
            Pending {pendingCount > 0 && <span className="ml-1 px-1.5 py-0.5 text-xs bg-warning/20 text-warning rounded-full">{pendingCount}</span>}
          </TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-card">Approved</TabsTrigger>
          <TabsTrigger value="rejected" className="data-[state=active]:bg-card">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Data Table */}
      <DataTable
        data={filteredRequests}
        columns={columns}
        searchPlaceholder="Search credit requests..."
        actions={(request) => (
          <div className="flex items-center gap-1">
            {request.status === "pending" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleAction(request, "approve")}
                  className="text-muted-foreground hover:text-success"
                >
                  <CheckCircle className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleAction(request, "reject")}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </>
            )}
            {request.status !== "pending" && request.remarks && (
              <span className="text-xs text-muted-foreground max-w-[150px] truncate" title={request.remarks}>
                {request.remarks}
              </span>
            )}
          </div>
        )}
        mobileCard={(request) => (
          <div className="mobile-card">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-foreground">{request.shopName}</p>
                <p className="text-sm text-muted-foreground">{request.ownerName}</p>
              </div>
              <StatusBadge 
                status={
                  request.status === "approved" ? "success" 
                  : request.status === "pending" ? "warning" 
                  : "danger"
                } 
                label={request.status.charAt(0).toUpperCase() + request.status.slice(1)} 
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Current Limit</p>
                <p className="font-medium">₨{request.currentLimit.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Requested</p>
                <p className="font-medium text-primary">₨{request.requestedLimit.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Balance</p>
                <p className={request.currentBalance > 0 ? "text-destructive" : "text-success"}>
                  ₨{request.currentBalance.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Zone</p>
                <StatusBadge status="info" label={request.zone} />
              </div>
            </div>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-1">Reason:</p>
              <p className="text-sm">{request.reason}</p>
            </div>
            {request.status === "pending" && (
              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction(request, "reject")}
                  className="text-destructive"
                >
                  <XCircle className="w-4 h-4 mr-1" /> Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAction(request, "approve")}
                  className="bg-success text-success-foreground"
                >
                  <CheckCircle className="w-4 h-4 mr-1" /> Approve
                </Button>
              </div>
            )}
          </div>
        )}
      />

      {/* Action Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {actionType === "approve" ? "Approve Credit Request" : "Reject Credit Request"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" 
                ? "This will increase the shop's credit limit."
                : "Please provide a reason for rejection."}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                <p className="font-medium">{selectedRequest.shopName}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Limit:</span>
                  <span>₨{selectedRequest.currentLimit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Requested Limit:</span>
                  <span className="text-primary font-medium">₨{selectedRequest.requestedLimit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Increase:</span>
                  <span className="text-success font-medium">+₨{(selectedRequest.requestedLimit - selectedRequest.currentLimit).toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Remarks {actionType === "reject" && <span className="text-destructive">*</span>}</Label>
                <Textarea
                  placeholder={actionType === "approve" ? "Optional remarks..." : "Reason for rejection..."}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className={actionType === "approve" ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}
              disabled={actionType === "reject" && !remarks.trim()}
            >
              {actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
