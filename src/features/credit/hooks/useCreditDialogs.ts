import { useState } from "react";
import type { CreditLimitRequest, CreditActionType } from "../types";

interface UseCreditDialogsReturn {
  // Approve / Reject dialog
  isActionDialogOpen: boolean;
  actionSelectedRequest: CreditLimitRequest | null;
  actionType: CreditActionType;
  actionRemarks: string;
  setActionRemarks: (v: string) => void;
  openActionDialog: (request: CreditLimitRequest, type: CreditActionType) => void;
  closeActionDialog: () => void;

  // View remarks
  isViewRemarksOpen: boolean;
  viewRemarks: string;
  viewRemarksShop: string;
  openViewRemarks: (remarks: string, shopName: string) => void;
  closeViewRemarks: () => void;

  // Delete
  deleteTarget: CreditLimitRequest | null;
  openDelete: (request: CreditLimitRequest) => void;
  closeDelete: () => void;

  // Edit request (pending)
  isEditRequestOpen: boolean;
  editRequestTarget: CreditLimitRequest | null;
  editRequestCreditLimit: string;
  editRequestRemarks: string;
  setEditRequestCreditLimit: (v: string) => void;
  setEditRequestRemarks: (v: string) => void;
  openEditRequest: (request: CreditLimitRequest) => void;
  closeEditRequest: () => void;

  // Edit shop (approved)
  isEditShopOpen: boolean;
  editShopTarget: CreditLimitRequest | null;
  editShopCreditLimit: string;
  setEditShopCreditLimit: (v: string) => void;
  openEditShop: (request: CreditLimitRequest) => void;
  closeEditShop: () => void;
}

export const useCreditDialogs = (): UseCreditDialogsReturn => {
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionSelectedRequest, setActionSelectedRequest] =
    useState<CreditLimitRequest | null>(null);
  const [actionType, setActionType] = useState<CreditActionType>("approve");
  const [actionRemarks, setActionRemarks] = useState("");

  const [isViewRemarksOpen, setIsViewRemarksOpen] = useState(false);
  const [viewRemarks, setViewRemarks] = useState("");
  const [viewRemarksShop, setViewRemarksShop] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<CreditLimitRequest | null>(null);

  const [isEditRequestOpen, setIsEditRequestOpen] = useState(false);
  const [editRequestTarget, setEditRequestTarget] =
    useState<CreditLimitRequest | null>(null);
  const [editRequestCreditLimit, setEditRequestCreditLimit] = useState("");
  const [editRequestRemarks, setEditRequestRemarks] = useState("");

  const [isEditShopOpen, setIsEditShopOpen] = useState(false);
  const [editShopTarget, setEditShopTarget] = useState<CreditLimitRequest | null>(null);
  const [editShopCreditLimit, setEditShopCreditLimit] = useState("");

  const openActionDialog = (request: CreditLimitRequest, type: CreditActionType) => {
    setActionSelectedRequest(request);
    setActionType(type);
    setActionRemarks("");
    setIsActionDialogOpen(true);
  };

  const closeActionDialog = () => {
    setIsActionDialogOpen(false);
    setActionSelectedRequest(null);
  };

  const openViewRemarks = (remarks: string, shopName: string) => {
    setViewRemarks(remarks);
    setViewRemarksShop(shopName);
    setIsViewRemarksOpen(true);
  };

  const closeViewRemarks = () => setIsViewRemarksOpen(false);

  const openDelete = (request: CreditLimitRequest) => setDeleteTarget(request);
  const closeDelete = () => setDeleteTarget(null);

  const openEditRequest = (request: CreditLimitRequest) => {
    setEditRequestTarget(request);
    setEditRequestCreditLimit(String(request.requested_credit_limit));
    setEditRequestRemarks(request.remarks || "");
    setIsEditRequestOpen(true);
  };

  const closeEditRequest = () => {
    setIsEditRequestOpen(false);
    setEditRequestTarget(null);
  };

  const openEditShop = (request: CreditLimitRequest) => {
    setEditShopTarget(request);
    setEditShopCreditLimit(String(request.requested_credit_limit));
    setIsEditShopOpen(true);
  };

  const closeEditShop = () => {
    setIsEditShopOpen(false);
    setEditShopTarget(null);
  };

  return {
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
  };
};
