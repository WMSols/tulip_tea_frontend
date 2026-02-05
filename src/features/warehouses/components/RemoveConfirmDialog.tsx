import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { WarehouseDeliveryMan } from "../types";

interface RemoveConfirmDialogProps {
  isOpen: boolean;
  deliveryMan: WarehouseDeliveryMan | null;
  isRemoving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function RemoveConfirmDialog({
  isOpen,
  deliveryMan,
  isRemoving,
  onCancel,
  onConfirm,
}: RemoveConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove delivery man?</AlertDialogTitle>
          <AlertDialogDescription>
            {deliveryMan
              ? `Remove "${deliveryMan.name}" (ID: ${deliveryMan.id}) from this warehouse?`
              : "Remove selected delivery man from this warehouse?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isRemoving} onClick={onCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction disabled={isRemoving} onClick={onConfirm}>
            {isRemoving ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
