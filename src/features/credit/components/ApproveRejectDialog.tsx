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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { CreditLimitRequest, CreditActionType } from "../types";

interface ApproveRejectDialogProps {
  isOpen: boolean;
  request: CreditLimitRequest | null;
  actionType: CreditActionType;
  remarks: string;
  onRemarksChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function ApproveRejectDialog({
  isOpen,
  request,
  actionType,
  remarks,
  onRemarksChange,
  onClose,
  onSubmit,
  isSubmitting,
}: ApproveRejectDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === "approve"
              ? "Approve Credit Request"
              : "Reject Credit Request"}
          </DialogTitle>
          <DialogDescription>{request?.shop_name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Remarks</Label>
          <Textarea value={remarks} onChange={(e) => onRemarksChange(e.target.value)} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {actionType === "approve" ? "Approve" : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
