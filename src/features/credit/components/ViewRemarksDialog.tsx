import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ViewRemarksDialogProps {
  isOpen: boolean;
  shopName: string;
  remarks: string;
  onClose: () => void;
}

export default function ViewRemarksDialog({
  isOpen,
  shopName,
  remarks,
  onClose,
}: ViewRemarksDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remarks</DialogTitle>
          <DialogDescription>{shopName}</DialogDescription>
        </DialogHeader>

        <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap">
          {remarks}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
