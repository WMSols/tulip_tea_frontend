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
import { Label } from "@/components/ui/label";
import type { CreditLimitRequest } from "../types";

interface EditShopDialogProps {
  isOpen: boolean;
  request: CreditLimitRequest | null;
  creditLimit: string;
  onCreditLimitChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function EditShopDialog({
  isOpen,
  request,
  creditLimit,
  onCreditLimitChange,
  onClose,
  onSubmit,
  isSubmitting,
}: EditShopDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit shop credit limit</DialogTitle>
          <DialogDescription>{request?.shop_name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-shop-credit-limit">
              Credit limit <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-shop-credit-limit"
              type="number"
              min={0}
              value={creditLimit}
              onChange={(e) => onCreditLimitChange(e.target.value)}
              placeholder="Enter credit limit"
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
