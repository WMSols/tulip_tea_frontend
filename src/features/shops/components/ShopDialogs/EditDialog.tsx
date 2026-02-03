import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shop: UiShop | null;
}

export function EditDialog({ isOpen, onClose, shop }: EditDialogProps) {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Shop Updated",
      description: "Shop details have been updated.",
    });
    onClose();
  };

  if (!shop) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Edit Shop</DialogTitle>
          <DialogDescription>
            Update shop details and credit information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Shop Name</Label>
            <Input
              defaultValue={shop.name}
              className="bg-background border-border"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Credit Limit</Label>
              <Input
                type="number"
                defaultValue={shop.creditLimit}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Current Balance</Label>
              <Input
                type="number"
                defaultValue={shop.balance}
                className="bg-background border-border"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-primary text-primary-foreground"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
