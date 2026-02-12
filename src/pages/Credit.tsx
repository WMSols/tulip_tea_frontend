import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { PageSkeleton } from "@/components/dashboard/PageSkeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/Redux/Hooks/hooks";

import {
  useGetAllCreditLimitRequestsQuery,
  useUpdateCreditLimitRequestMutation,
  useApproveCreditLimitRequestMutation,
  useRejectCreditLimitRequestMutation,
} from "@/Redux/Api/creditLimitApi";
import { CreditLimitRequest } from "@/types/creditLimit";

export default function Credit() {
  const distributorId = useAppSelector((s) => s.auth.user.id);
  const { toast } = useToast();

  const { data = [], isLoading } = useGetAllCreditLimitRequestsQuery(distributorId);

  const [approveRequest, { isLoading: approving }] =
    useApproveCreditLimitRequestMutation();
  const [rejectRequest, { isLoading: rejecting }] =
    useRejectCreditLimitRequestMutation();
  const [updateRequest, { isLoading: updating }] =
    useUpdateCreditLimitRequestMutation();

  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "approved" | "disapproved"
  >("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<CreditLimitRequest | null>(null);
  const [actionType, setActionType] = useState<"approve" | "disapproved">(
    "approve",
  );
  const [remarks, setRemarks] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewRemarks, setViewRemarks] = useState<string>("");
  const [viewShop, setViewShop] = useState<string>("");

  // Edit modal state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CreditLimitRequest | null>(null);
  const [editCreditLimit, setEditCreditLimit] = useState<string>("");
  const [editRemarks, setEditRemarks] = useState<string>("");

  const handleAction = (
    request: CreditLimitRequest,
    type: "approve" | "disapproved",
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

  const handleEdit = (request: CreditLimitRequest) => {
    setEditTarget(request);
    setEditCreditLimit(String(request.requested_credit_limit));
    setEditRemarks(request.remarks || "");
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editTarget) return;
    const creditLimit = Number(editCreditLimit);
    if (!creditLimit || creditLimit <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid credit limit.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateRequest({
        requestId: editTarget.id,
        body: {
          requested_credit_limit: creditLimit,
          ...(editRemarks.trim() ? { remarks: editRemarks.trim() } : {}),
        },
      }).unwrap();

      toast({ title: "Request Updated", description: "Credit limit request has been updated." });
      setIsEditDialogOpen(false);
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
    {
      key: "remarks",
      label: "Remarks",
      render: (r: CreditLimitRequest) => {
        if (r.status === "pending") {
          return <span className="text-muted-foreground">-</span>;
        }

        if (!r.remarks) {
          return (
            <span className="text-muted-foreground text-sm">No remarks</span>
          );
        }

        return (
          <div className="flex items-center justify-between w-[220px]">
            <span className="text-sm truncate pr-2">{r.remarks}</span>

            <Button
              size="icon"
              variant="ghost"
              className="shrink-0"
              onClick={() => {
                setViewRemarks(r.remarks || "");
                setViewShop(r.shop_name);
                setIsViewDialogOpen(true);
              }}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <PageSkeleton
        statCards={0}
        showFilters
        tableColumns={5}
        tableRows={6}
        showHeader
      />
    );
  }

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
          <TabsTrigger value="disapproved">Disapproved</TabsTrigger>
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
                onClick={() => handleEdit(request)}
                title="Edit Request"
              >
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </Button>
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
                onClick={() => handleAction(request, "disapproved")}
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

      {/* View Remarks */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remarks</DialogTitle>
            <DialogDescription>{viewShop}</DialogDescription>
          </DialogHeader>

          <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap">
            {viewRemarks}
          </div>

          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Credit Limit Request */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Credit Limit Request</DialogTitle>
            <DialogDescription>{editTarget?.shop_name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-credit-limit">
                Requested Credit Limit <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-credit-limit"
                type="number"
                min={0}
                value={editCreditLimit}
                onChange={(e) => setEditCreditLimit(e.target.value)}
                placeholder="Enter credit limit"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-remarks">Remarks</Label>
              <Textarea
                id="edit-remarks"
                value={editRemarks}
                onChange={(e) => setEditRemarks(e.target.value)}
                placeholder="Optional remarks..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={updating}>
              {updating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
