import { useState } from "react";
import { Banknote, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { FormField } from "@/components/ui/FormField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "../utils/formatters";
import { getRoleStatus, getRoleLabel } from "../utils/helpers";
import { collectMoneySchema, validateForm, type FormErrors } from "@/lib/validations";
import type { TeamWallet, CollectFormData } from "../types";

interface CollectMoneyDialogProps {
  collectTarget: TeamWallet | null;
  formData: CollectFormData;
  isCollecting: boolean;
  onFormChange: React.Dispatch<React.SetStateAction<CollectFormData>>;
  onCollect: () => void;
  onClose: () => void;
}

export default function CollectMoneyDialog({
  collectTarget,
  formData,
  isCollecting,
  onFormChange,
  onCollect,
  onClose,
}: CollectMoneyDialogProps) {
  const [errors, setErrors] = useState<FormErrors<CollectFormData>>({});

  const clearFieldError = (field: keyof CollectFormData) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleCollect = () => {
    if (!collectTarget) return;
    const schema = collectMoneySchema(collectTarget.current_balance);
    const validationErrors = validateForm(schema as any, formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onCollect();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={!!collectTarget} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-card border-border rounded-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Collect Money from {collectTarget?.user_name}
          </DialogTitle>
          <DialogDescription>
            Transfer funds from team member to your wallet
          </DialogDescription>
        </DialogHeader>

        {collectTarget && (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
              <StatusBadge
                status={getRoleStatus(collectTarget.user_type)}
                label={getRoleLabel(collectTarget.user_type)}
              />
              <span className="font-semibold text-success">
                {formatCurrency(collectTarget.current_balance)}
              </span>
            </div>

            <FormField label="Amount" error={errors.amount}>
              <Input
                type="number"
                placeholder="Enter amount"
                min={1}
                max={collectTarget.current_balance}
                value={formData.amount}
                onChange={(e) => {
                  onFormChange((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }));
                  clearFieldError("amount");
                }}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Maximum: {formatCurrency(collectTarget.current_balance)}
              </p>
            </FormField>

            <FormField label="Description" optional>
              <Textarea
                placeholder="Add a note..."
                value={formData.description}
                onChange={(e) =>
                  onFormChange((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="bg-background"
              />
            </FormField>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={isCollecting}>
            Cancel
          </Button>
          <Button
            onClick={handleCollect}
            disabled={isCollecting}
            className="gap-2"
          >
            {isCollecting && <Loader2 className="w-4 h-4 animate-spin" />}
            <Banknote className="w-4 h-4" />
            Collect Money
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
