import { useState } from "react";
import { useAppSelector } from "@/Redux/Hooks/hooks";
import { PageSkeleton } from "@/components/dashboard/PageSkeleton";
import { useToast } from "@/hooks/use-toast";

import CreditHeader from "@/features/credit/components/CreditHeader";
import CreditTable from "@/features/credit/components/CreditTable";
import ApproveRejectDialog from "@/features/credit/components/ApproveRejectDialog";
import ViewRemarksDialog from "@/features/credit/components/ViewRemarksDialog";
import DeleteConfirmDialog from "@/features/credit/components/DeleteConfirmDialog";
import EditRequestDialog from "@/features/credit/components/EditRequestDialog";
import EditShopDialog from "@/features/credit/components/EditShopDialog";

import { useCreditData } from "@/features/credit/hooks/useCreditData";
import { useCreditActions } from "@/features/credit/hooks/useCreditActions";
import { useCreditDialogs } from "@/features/credit/hooks/useCreditDialogs";
import type { CreditTab, CreditLimitRequest } from "@/features/credit/types";

export default function Credit() {
  const distributorId = useAppSelector((s) => s.auth.user.id);
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<CreditTab>("all");

  const { filteredRequests, pendingCount, isLoading } = useCreditData(
    distributorId,
    activeTab,
  );
  const headerRefreshing = useAppSelector((s) => s.ui.headerRefreshing);

  const {
    handleApproveReject,
    handleUpdateRequest,
    handleUpdateShop,
    handleDelete,
    isApproving,
    isRejecting,
    isUpdating,
    isUpdatingShop,
    isDeleting,
  } = useCreditActions({ distributorId });

  const {
    isActionDialogOpen,
    actionSelectedRequest,
    actionType,
    actionRemarks,
    setActionRemarks,
    openActionDialog,
    closeActionDialog,
    isViewRemarksOpen,
    viewRemarks,
    viewRemarksShop,
    openViewRemarks,
    closeViewRemarks,
    deleteTarget,
    openDelete,
    closeDelete,
    isEditRequestOpen,
    editRequestTarget,
    editRequestCreditLimit,
    editRequestRemarks,
    setEditRequestCreditLimit,
    setEditRequestRemarks,
    openEditRequest,
    closeEditRequest,
    isEditShopOpen,
    editShopTarget,
    editShopCreditLimit,
    setEditShopCreditLimit,
    openEditShop,
    closeEditShop,
  } = useCreditDialogs();

  const handleEdit = (request: CreditLimitRequest) => {
    if (request.status === "approved") {
      openEditShop(request);
    } else {
      openEditRequest(request);
    }
  };

  const onActionSubmit = async () => {
    if (!actionSelectedRequest) return;
    const ok = await handleApproveReject(
      actionSelectedRequest,
      actionType,
      actionRemarks,
    );
    if (ok) closeActionDialog();
  };

  const onEditRequestSubmit = async () => {
    if (!editRequestTarget) return;
    const creditLimit = Number(editRequestCreditLimit);
    if (!creditLimit || creditLimit <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid credit limit.",
        variant: "destructive",
      });
      return;
    }
    const ok = await handleUpdateRequest(
      editRequestTarget,
      creditLimit,
      editRequestRemarks,
    );
    if (ok) closeEditRequest();
  };

  const onEditShopSubmit = async () => {
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
    const ok = await handleUpdateShop(editShopTarget, creditLimit);
    if (ok) closeEditShop();
  };

  const onDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const ok = await handleDelete(deleteTarget);
    if (ok) closeDelete();
  };

  if (isLoading || headerRefreshing) {
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
      <CreditHeader />

      <CreditTable
        activeTab={activeTab}
        onTabChange={setActiveTab}
        filteredRequests={filteredRequests}
        pendingCount={pendingCount}
        onViewRemarks={openViewRemarks}
        onEdit={handleEdit}
        onApprove={(r) => openActionDialog(r, "approve")}
        onReject={(r) => openActionDialog(r, "disapproved")}
        onDelete={openDelete}
      />

      <ApproveRejectDialog
        isOpen={isActionDialogOpen}
        request={actionSelectedRequest}
        actionType={actionType}
        remarks={actionRemarks}
        onRemarksChange={setActionRemarks}
        onClose={closeActionDialog}
        onSubmit={onActionSubmit}
        isSubmitting={isApproving || isRejecting}
      />

      <ViewRemarksDialog
        isOpen={isViewRemarksOpen}
        shopName={viewRemarksShop}
        remarks={viewRemarks}
        onClose={closeViewRemarks}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        request={deleteTarget}
        onClose={closeDelete}
        onConfirm={onDeleteConfirm}
        isDeleting={isDeleting}
      />

      <EditRequestDialog
        isOpen={isEditRequestOpen}
        request={editRequestTarget}
        creditLimit={editRequestCreditLimit}
        remarks={editRequestRemarks}
        onCreditLimitChange={setEditRequestCreditLimit}
        onRemarksChange={setEditRequestRemarks}
        onClose={closeEditRequest}
        onSubmit={onEditRequestSubmit}
        isSubmitting={isUpdating}
      />

      <EditShopDialog
        isOpen={isEditShopOpen}
        request={editShopTarget}
        creditLimit={editShopCreditLimit}
        onCreditLimitChange={setEditShopCreditLimit}
        onClose={closeEditShop}
        onSubmit={onEditShopSubmit}
        isSubmitting={isUpdatingShop}
      />
    </div>
  );
}
