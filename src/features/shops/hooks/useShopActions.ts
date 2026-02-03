import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  useVerifyShopMutation,
  useReassignShopMutation,
} from "@/Redux/Api/shopsApi";
import { REJECTION_REASON } from "../utils/constants";

/**
 * Hook to manage shop actions (approve, reject, reassign)
 */
export function useShopActions(distributorId: number) {
  const { toast } = useToast();
  const [verifyShop, { isLoading: isVerifying }] = useVerifyShopMutation();
  const [reassignShop, { isLoading: isReassigning }] =
    useReassignShopMutation();

  const handleApprove = async (shopId: number, onSuccess?: () => void) => {
    try {
      await verifyShop({
        shop_id: shopId,
        distributor_id: distributorId,
        body: { registration_status: "approved" },
      }).unwrap();

      toast({
        title: "Shop Approved",
        description: "Shop registration has been approved.",
      });

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to approve shop.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (shopId: number, onSuccess?: () => void) => {
    try {
      await verifyShop({
        shop_id: shopId,
        distributor_id: distributorId,
        body: {
          registration_status: "rejected",
          remarks: REJECTION_REASON,
        },
      }).unwrap();

      toast({
        title: "Shop Rejected",
        description: "Shop registration has been rejected.",
        variant: "destructive",
      });

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to reject shop.",
        variant: "destructive",
      });
    }
  };

  const handleReassign = async (
    shopId: number,
    newOrderBookerId: number,
    onSuccess?: () => void,
  ) => {
    try {
      await reassignShop({
        shop_id: shopId,
        new_order_booker_id: newOrderBookerId,
      }).unwrap();

      toast({
        title: "Shop Reassigned",
        description: "Shop assigned to new order booker.",
      });

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.detail || "Failed to reassign shop.",
        variant: "destructive",
      });
    }
  };

  return {
    handleApprove,
    handleReject,
    handleReassign,
    isVerifying,
    isReassigning,
  };
}
