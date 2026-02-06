import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PRODUCT_UNITS } from "../utils/constants";
import type { ProductFormData, ProductDialogMode } from "../types";

interface ProductFormDialogProps {
  isOpen: boolean;
  mode: ProductDialogMode;
  formData: ProductFormData;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onFormChange: (formData: ProductFormData) => void;
  onSubmit: () => void;
  triggerButton?: React.ReactNode;
}

export default function ProductFormDialog({
  isOpen,
  mode,
  formData,
  isSubmitting,
  onOpenChange,
  onFormChange,
  onSubmit,
  triggerButton,
}: ProductFormDialogProps) {
  const isEditMode = mode === "edit";

  const defaultTrigger = (
    <Button className="gap-2">
      <Plus className="w-4 h-4" />
      Add Product
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {triggerButton !== undefined ? (
        triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>{defaultTrigger}</DialogTrigger>
      )}

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Product" : "Add Product"}
          </DialogTitle>
          <DialogDescription>Enter product details below</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Product Code</Label>
              <Input
                value={formData.code}
                onChange={(e) =>
                  onFormChange({ ...formData, code: e.target.value })
                }
                placeholder="e.g., TEA001"
              />
            </div>

            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  onFormChange({ ...formData, price: e.target.value })
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                onFormChange({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Green Tea Premium"
            />
          </div>

          <div className="space-y-2">
            <Label>Unit</Label>
            <Select
              value={formData.unit}
              onValueChange={(value) =>
                onFormChange({ ...formData, unit: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_UNITS.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isEditMode && (
            <div className="flex items-center justify-between">
              <Label>Active Status</Label>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  onFormChange({ ...formData, is_active: checked })
                }
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEditMode ? "Update Product" : "Create Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
