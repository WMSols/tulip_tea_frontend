import { useState } from "react";
import { INITIAL_COLLECT_FORM } from "../utils/constants";
import type { TeamWallet, CollectFormData } from "../types";

interface UseCollectDialogReturn {
  collectTarget: TeamWallet | null;
  formData: CollectFormData;
  setFormData: React.Dispatch<React.SetStateAction<CollectFormData>>;
  openCollectDialog: (wallet: TeamWallet) => void;
  closeCollectDialog: () => void;
}

/**
 * Hook for managing the collect money dialog state
 */
export const useCollectDialog = (): UseCollectDialogReturn => {
  const [collectTarget, setCollectTarget] = useState<TeamWallet | null>(null);
  const [formData, setFormData] =
    useState<CollectFormData>(INITIAL_COLLECT_FORM);

  const openCollectDialog = (wallet: TeamWallet) => {
    setCollectTarget(wallet);
    setFormData(INITIAL_COLLECT_FORM);
  };

  const closeCollectDialog = () => {
    setCollectTarget(null);
    setFormData(INITIAL_COLLECT_FORM);
  };

  return {
    collectTarget,
    formData,
    setFormData,
    openCollectDialog,
    closeCollectDialog,
  };
};
