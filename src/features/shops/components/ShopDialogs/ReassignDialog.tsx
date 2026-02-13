import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { OrderBooker } from "../../types";

interface ReassignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderBookers: OrderBooker[];
  selectedOrderBookerId: number | null;
  onOrderBookerChange: (id: number) => void;
  onReassign: () => void;
  isReassigning: boolean;
}

export function ReassignDialog({
  isOpen,
  onClose,
  orderBookers,
  selectedOrderBookerId,
  onOrderBookerChange,
  onReassign,
  isReassigning,
}: ReassignDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reassign Shop</DialogTitle>
          <DialogDescription>
            Assign this shop to another order booker
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Label>Order Booker</Label>
          <Select
            value={selectedOrderBookerId?.toString() || ""}
            onValueChange={(value) => onOrderBookerChange(Number(value))}
            disabled={orderBookers.length === 0}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  orderBookers.length === 0
                    ? "No order bookers in this zone"
                    : "Select order booker"
                }
              />
            </SelectTrigger>

            <SelectContent>
              {orderBookers.map((ob) => (
                <SelectItem key={ob.id} value={String(ob.id)}>
                  {ob.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={isReassigning || !selectedOrderBookerId}
            onClick={onReassign}
          >
            {isReassigning ? "Reassigning..." : "Reassign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
