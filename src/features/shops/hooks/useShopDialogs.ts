import { useState } from "react";
import type { UiShop } from "../types";

/**
 * Hook to manage shop dialog states
 */
export function useShopDialogs() {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isReassignDialogOpen, setIsReassignDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<UiShop | null>(null);
  const [rejectTargetShop, setRejectTargetShop] = useState<UiShop | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedOrderBookerId, setSelectedOrderBookerId] = useState<
    number | null
  >(null);

  const handleViewShop = (shop: UiShop) => {
    setSelectedShop(shop);
    setIsViewDialogOpen(true);
  };

  const handleEditShop = (shop: UiShop) => {
    setSelectedShop(shop);
    setIsEditDialogOpen(true);
  };

  const handleReassignShop = (shop: UiShop) => {
    setSelectedShop(shop);
    setSelectedOrderBookerId(shop.assignedOrderBookerId ?? null);
    setIsReassignDialogOpen(true);
  };

  const openRejectDialog = (shop: UiShop) => {
    setRejectTargetShop(shop);
    setRejectionReason("");
    setIsRejectDialogOpen(true);
  };

  const closeRejectDialog = () => {
    setIsRejectDialogOpen(false);
    setRejectTargetShop(null);
    setRejectionReason("");
  };

  const closeViewDialog = () => {
    setIsViewDialogOpen(false);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const closeReassignDialog = () => {
    setIsReassignDialogOpen(false);
    setSelectedOrderBookerId(null);
  };

  return {
    isViewDialogOpen,
    isEditDialogOpen,
    isReassignDialogOpen,
    isRejectDialogOpen,
    selectedShop,
    rejectTargetShop,
    rejectionReason,
    setRejectionReason,
    selectedOrderBookerId,
    setSelectedOrderBookerId,
    handleViewShop,
    handleEditShop,
    handleReassignShop,
    openRejectDialog,
    closeRejectDialog,
    closeViewDialog,
    closeEditDialog,
    closeReassignDialog,
  };
}
