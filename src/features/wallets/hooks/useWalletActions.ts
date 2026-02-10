import { useAppSelector } from "@/Redux/Hooks/hooks";
import { useCollectFromWalletMutation } from "@/Redux/Api/walletsApi";
import { useToast } from "@/hooks/use-toast";
import { validateCollectForm } from "../utils/helpers";
import { formatCurrency } from "../utils/formatters";
import type { TeamWallet, CollectFormData } from "../types";

interface UseWalletActionsReturn {
  handleCollect: (
    target: TeamWallet,
    form: CollectFormData,
  ) => Promise<boolean>;
  isCollecting: boolean;
}

/**
 * Hook for wallet mutation operations (collect money)
 */
export const useWalletActions = (): UseWalletActionsReturn => {
  const distributorId = useAppSelector((s) => s.auth.user!.id);
  const { toast } = useToast();
  const [collectFromWallet, { isLoading: isCollecting }] =
    useCollectFromWalletMutation();

  const handleCollect = async (
    target: TeamWallet,
    form: CollectFormData,
  ): Promise<boolean> => {

    const validation = validateCollectForm(form, target.current_balance);
    if (!validation.valid) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: validation.error,
      });
      return false;
    }

    try {
      await collectFromWallet({
        distributorId,
        body: {
          from_user_type: target.user_type,
          from_user_id: target.user_id,
          amount: parseFloat(form.amount),
          description:
            form.description.trim() ||
            `Collection by distributor from ${target.user_type.replace("_", " ")}`,
          metadata: {},
        },
      }).unwrap();

      toast({
        title: "Collection Successful",
        description: `Collected ${formatCurrency(parseFloat(form.amount))} from ${target.user_name}`,
      });
      return true;
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Collection Failed",
        description:
          err?.data?.detail || err?.data?.message || "Something went wrong",
      });
      return false;
    }
  };

  return {
    handleCollect,
    isCollecting,
  };
};
