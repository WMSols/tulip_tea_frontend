import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { FormField } from "@/components/ui/FormField";
import { PRODUCT_UNITS } from "../utils/constants";
import { productSchema, validateForm, type FormErrors } from "@/lib/validations";
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
  const [errors, setErrors] = useState<FormErrors<ProductFormData>>({});

  const clearFieldError = (field: keyof ProductFormData) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    const validationErrors = validateForm(productSchema, formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onSubmit();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) setErrors({});
    onOpenChange(open);
  };

  const defaultTrigger = (
    <Button className="gap-2">
      <Plus className="w-4 h-4" />
      Add Product
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
            <FormField label="Product Code" error={errors.code}>
              <Input
                value={formData.code}
                onChange={(e) => {
                  onFormChange({ ...formData, code: e.target.value });
                  clearFieldError("code");
                }}
                placeholder="e.g., TEA001"
              />
            </FormField>

            <FormField label="Price" error={errors.price}>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => {
                  onFormChange({ ...formData, price: e.target.value });
                  clearFieldError("price");
                }}
                placeholder="0"
              />
            </FormField>
          </div>

          <FormField label="Product Name" error={errors.name}>
            <Input
              value={formData.name}
              onChange={(e) => {
                onFormChange({ ...formData, name: e.target.value });
                clearFieldError("name");
              }}
              placeholder="e.g., Green Tea Premium"
            />
          </FormField>

          <FormField label="Unit" error={errors.unit}>
            <Select
              value={formData.unit}
              onValueChange={(value) => {
                onFormChange({ ...formData, unit: value });
                clearFieldError("unit");
              }}
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
          </FormField>

          {isEditMode && (
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium leading-none">
                Active Status
              </label>
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
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEditMode ? "Update Product" : "Create Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
