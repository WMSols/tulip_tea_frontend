import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { CreditLimitRequest } from "../types";

interface EditRequestDialogProps {
  isOpen: boolean;
  request: CreditLimitRequest | null;
  creditLimit: string;
  remarks: string;
  onCreditLimitChange: (value: string) => void;
  onRemarksChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function EditRequestDialog({
  isOpen,
  request,
  creditLimit,
  remarks,
  onCreditLimitChange,
  onRemarksChange,
  onClose,
  onSubmit,
  isSubmitting,
}: EditRequestDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Credit Limit Request</DialogTitle>
          <DialogDescription>{request?.shop_name}</DialogDescription>
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
              value={creditLimit}
              onChange={(e) => onCreditLimitChange(e.target.value)}
              placeholder="Enter credit limit"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-remarks">Remarks</Label>
            <Textarea
              id="edit-remarks"
              value={remarks}
              onChange={(e) => onRemarksChange(e.target.value)}
              placeholder="Optional remarks..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
