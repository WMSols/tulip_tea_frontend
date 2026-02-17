import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  Pencil,
  Trash2,
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
  useDeleteCreditLimitRequestMutation,
} from "@/Redux/Api/creditLimitApi";
import { useUpdateShopMutation } from "@/Redux/Api/shopsApi";
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
  const [updateShop, { isLoading: updatingShop }] = useUpdateShopMutation();
  const [deleteCreditLimitRequest, { isLoading: deleting }] =
    useDeleteCreditLimitRequestMutation();

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

  // Edit modal state (pending: edit credit limit request)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CreditLimitRequest | null>(null);
  const [editCreditLimit, setEditCreditLimit] = useState<string>("");
  const [editRemarks, setEditRemarks] = useState<string>("");

  // Edit shop credit limit modal (approved only — updates shop via PUT /shops/{shop_id})
  const [isEditShopDialogOpen, setIsEditShopDialogOpen] = useState(false);
  const [editShopTarget, setEditShopTarget] =
    useState<CreditLimitRequest | null>(null);
  const [editShopCreditLimit, setEditShopCreditLimit] = useState<string>("");

  // Delete (disapproved only)
  const [deleteTarget, setDeleteTarget] = useState<CreditLimitRequest | null>(null);

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
    if (request.status === "approved") {
      setEditShopTarget(request);
      setEditShopCreditLimit(String(request.requested_credit_limit));
      setIsEditShopDialogOpen(true);
      return;
    }
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCreditLimitRequest(deleteTarget.id).unwrap();
      toast({ title: "Request deleted", description: "Credit limit request has been removed." });
      setDeleteTarget(null);
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    }
  };

  const handleEditShopSubmit = async () => {
    if (!editShopTarget) return;
    const creditLimit = Number(editShopCreditLimit);
    if (!creditLimit || creditLimit <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid credit limit.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateShop({
        shop_id: editShopTarget.shop_id,
        body: { credit_limit: creditLimit },
      }).unwrap();

      toast({
        title: "Shop Updated",
        description: "Shop credit limit has been updated.",
      });
      setIsEditShopDialogOpen(false);
      setEditShopTarget(null);
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
        actions={(request) => {
          const isPendingOrApproved =
            request.status === "pending" || request.status === "approved";
          const isDisapproved = request.status === "disapproved";
          if (!isPendingOrApproved && !isDisapproved) return null;
          return (
            <div className="flex gap-2">
              {isPendingOrApproved && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(request)}
                    title="Edit Request"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  {request.status === "pending" && (
                    <>
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
                    </>
                  )}
                </>
              )}
              {isDisapproved && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setDeleteTarget(request)}
                  title="Delete request"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          );
        }}
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

      {/* Delete credit limit request (disapproved only) */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete credit limit request</DialogTitle>
            <DialogDescription>
              Remove this request for {deleteTarget?.shop_name}? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Credit Limit Request (pending only) */}
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

      {/* Edit shop credit limit (approved only — PUT /shops/{shop_id}) */}
      <Dialog
        open={isEditShopDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditShopDialogOpen(false);
            setEditShopTarget(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit shop credit limit</DialogTitle>
            <DialogDescription>{editShopTarget?.shop_name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-shop-credit-limit">
                Credit limit <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-shop-credit-limit"
                type="number"
                min={0}
                value={editShopCreditLimit}
                onChange={(e) => setEditShopCreditLimit(e.target.value)}
                placeholder="Enter credit limit"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditShopDialogOpen(false);
                setEditShopTarget(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditShopSubmit} disabled={updatingShop}>
              {updatingShop && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
