import { Banknote, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
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
  return (
    <Dialog open={!!collectTarget} onOpenChange={(open) => !open && onClose()}>
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

            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                min={1}
                max={collectTarget.current_balance}
                value={formData.amount}
                onChange={(e) =>
                  onFormChange((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Maximum: {formatCurrency(collectTarget.current_balance)}
              </p>
            </div>

            <div className="space-y-2">
              <Label>
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
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
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isCollecting}>
            Cancel
          </Button>
          <Button
            onClick={onCollect}
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
