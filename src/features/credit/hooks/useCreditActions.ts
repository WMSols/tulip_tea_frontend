import { useToast } from "@/hooks/use-toast";
import {
  useUpdateCreditLimitRequestMutation,
  useApproveCreditLimitRequestMutation,
  useRejectCreditLimitRequestMutation,
  useDeleteCreditLimitRequestMutation,
} from "@/Redux/Api/creditLimitApi";
import { useUpdateShopMutation } from "@/Redux/Api/shopsApi";
import type { CreditLimitRequest, CreditActionType } from "../types";

interface UseCreditActionsArgs {
  distributorId: number | null;
}

interface UseCreditActionsReturn {
  handleApproveReject: (
    request: CreditLimitRequest,
    type: CreditActionType,
    remarks: string,
  ) => Promise<boolean>;
  handleUpdateRequest: (
    request: CreditLimitRequest,
    requested_credit_limit: number,
    remarks?: string,
  ) => Promise<boolean>;
  handleUpdateShop: (request: CreditLimitRequest, credit_limit: number) => Promise<boolean>;
  handleDelete: (request: CreditLimitRequest) => Promise<boolean>;
  isApproving: boolean;
  isRejecting: boolean;
  isUpdating: boolean;
  isUpdatingShop: boolean;
  isDeleting: boolean;
}

export const useCreditActions = ({
  distributorId,
}: UseCreditActionsArgs): UseCreditActionsReturn => {
  const { toast } = useToast();

  const [approveRequest, { isLoading: isApproving }] =
    useApproveCreditLimitRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] =
    useRejectCreditLimitRequestMutation();
  const [updateRequest, { isLoading: isUpdating }] =
    useUpdateCreditLimitRequestMutation();
  const [updateShop, { isLoading: isUpdatingShop }] = useUpdateShopMutation();
  const [deleteCreditLimitRequest, { isLoading: isDeleting }] =
    useDeleteCreditLimitRequestMutation();

  const handleApproveReject = async (
    request: CreditLimitRequest,
    type: CreditActionType,
    remarks: string,
  ): Promise<boolean> => {
    try {
      if (type === "approve") {
        await approveRequest({
          requestId: request.id,
          distributorId: distributorId!,
          body: {
            final_credit_limit: request.requested_credit_limit,
            remarks,
          },
        }).unwrap();
        toast({ title: "Credit Approved" });
      } else {
        await rejectRequest({
          requestId: request.id,
          distributorId: distributorId!,
          body: { remarks },
        }).unwrap();
        toast({ title: "Credit Rejected", variant: "destructive" });
      }
      return true;
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
      return false;
    }
  };

  const handleUpdateRequest = async (
    request: CreditLimitRequest,
    requested_credit_limit: number,
    remarks?: string,
  ): Promise<boolean> => {
    try {
      await updateRequest({
        requestId: request.id,
        body: {
          requested_credit_limit,
          ...(remarks?.trim() ? { remarks: remarks.trim() } : {}),
        },
      }).unwrap();
      toast({
        title: "Request Updated",
        description: "Credit limit request has been updated.",
      });
      return true;
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
      return false;
    }
  };

  const handleUpdateShop = async (
    request: CreditLimitRequest,
    credit_limit: number,
  ): Promise<boolean> => {
    try {
      await updateShop({
        shop_id: request.shop_id,
        body: { credit_limit },
      }).unwrap();
      toast({
        title: "Shop Updated",
        description: "Shop credit limit has been updated.",
      });
      return true;
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
      return false;
    }
  };

  const handleDelete = async (request: CreditLimitRequest): Promise<boolean> => {
    try {
      await deleteCreditLimitRequest(request.id).unwrap();
      toast({
        title: "Request deleted",
        description: "Credit limit request has been removed.",
      });
      return true;
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
      return false;
    }
  };

  return {
    handleApproveReject,
    handleUpdateRequest,
    handleUpdateShop,
    handleDelete,
    isApproving,
    isRejecting,
    isUpdating,
    isUpdatingShop,
    isDeleting,
  };
};
