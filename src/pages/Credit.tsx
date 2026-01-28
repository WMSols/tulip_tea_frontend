import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  TrendingUp,
  Store,
  Loader2,
} from "lucide-react";
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
import { useAppSelector } from "@/Redux/Hooks/hooks";

import {
  useGetPendingCreditLimitRequestsQuery,
  useApproveCreditLimitRequestMutation,
  useRejectCreditLimitRequestMutation,
} from "@/Redux/Api/creditLimitApi";
import { CreditLimitRequest } from "@/types/creditLimit";

export default function Credit() {
  const distributorId = useAppSelector((s) => s.auth.user.id); // TODO: get from auth slice
  const { toast } = useToast();

  const { data = [], isLoading } = useGetPendingCreditLimitRequestsQuery();
  console.log(data);

  const [approveRequest, { isLoading: approving }] =
    useApproveCreditLimitRequestMutation();
  const [rejectRequest, { isLoading: rejecting }] =
    useRejectCreditLimitRequestMutation();

  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<CreditLimitRequest | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [remarks, setRemarks] = useState("");

  const handleAction = (
    request: CreditLimitRequest,
    type: "approve" | "reject",
  ) => {
    setSelectedRequest(request);
    setActionType(type);
    setRemarks("");
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedRequest) return;

    try {
      if (actionType === "approve") {
        await approveRequest({
          requestId: selectedRequest.id,
          distributorId,
          body: {
            final_credit_limit: selectedRequest.requested_credit_limit,
            remarks,
          },
        }).unwrap();

        toast({ title: "Credit Approved" });
      } else {
        await rejectRequest({
          requestId: selectedRequest.id,
          distributorId,
          body: { remarks },
        }).unwrap();

        toast({
          title: "Credit Rejected",
          variant: "destructive",
        });
      }

      setIsDialogOpen(false);
    } catch {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const filteredRequests =
    activeTab === "all" ? data : data.filter((r) => r.status === activeTab);

  const pendingCount = data.filter((r) => r.status === "pending").length;

  const columns = [
    { key: "shop_name", label: "Shop" },
    {
      key: "old_credit_limit",
      label: "Current",
      render: (r: CreditLimitRequest) =>
        `₨${r.old_credit_limit.toLocaleString()}`,
    },
    {
      key: "requested_credit_limit",
      label: "Requested",
      render: (r: CreditLimitRequest) => (
        <span className="text-primary font-medium">
          ₨{r.requested_credit_limit.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (r: CreditLimitRequest) => (
        <StatusBadge
          status={
            r.status === "approved"
              ? "success"
              : r.status === "pending"
                ? "warning"
                : "danger"
          }
          label={r.status.toUpperCase()}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Credit Management</h1>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">
            Pending {pendingCount > 0 && `(${pendingCount})`}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      <DataTable
        data={filteredRequests}
        columns={columns}
        actions={(request) =>
          request.status === "pending" && (
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleAction(request, "approve")}
              >
                <CheckCircle className="w-4 h-4 text-success" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleAction(request, "reject")}
              >
                <XCircle className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          )
        }
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve"
                ? "Approve Credit Request"
                : "Reject Credit Request"}
            </DialogTitle>
            <DialogDescription>{selectedRequest?.shop_name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label>Remarks</Label>
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={approving || rejecting}>
              {(approving || rejecting) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
