import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { UiShop } from "../../types";

interface RejectShopDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shop: UiShop | null;
  rejectionReason: string;
  onRejectionReasonChange: (value: string) => void;
  onConfirm: (remarks: string) => Promise<void>;
  isRejecting: boolean;
}

export function RejectShopDialog({
  isOpen,
  onClose,
  shop,
  rejectionReason,
  onRejectionReasonChange,
  onConfirm,
  isRejecting,
}: RejectShopDialogProps) {
  const { toast } = useToast();

  const handleSubmit = async () => {
    const trimmed = rejectionReason.trim();
    if (!trimmed) {
      toast({
        title: "Reason required",
        description: "Please enter a rejection reason.",
        variant: "destructive",
      });
      return;
    }
    await onConfirm(trimmed);
  };

  if (!shop) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Reject Shop</DialogTitle>
          <DialogDescription>
            Provide a reason for rejecting {shop.name}. This reason will be
            recorded and sent to the shop.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Rejection reason (required)</Label>
            <Textarea
              id="rejection-reason"
              placeholder="e.g. Incomplete documentation, invalid CNIC photos..."
              value={rejectionReason}
              onChange={(e) => onRejectionReasonChange(e.target.value)}
              className="min-h-[100px] bg-background border-border resize-y"
              disabled={isRejecting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isRejecting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isRejecting || !rejectionReason.trim()}
          >
            {isRejecting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              "Reject Shop"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
