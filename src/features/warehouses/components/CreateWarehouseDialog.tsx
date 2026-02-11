import { useState } from "react";
import { Plus } from "lucide-react";
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
import { FormField } from "@/components/ui/FormField";
import { warehouseSchema, validateForm, type FormErrors } from "@/lib/validations";
import type { Zone, CreateWarehouseForm } from "../types";

interface CreateWarehouseDialogProps {
  form: CreateWarehouseForm;
  zones: Zone[];
  isLoadingZones: boolean;
  isCreating: boolean;
  onFormChange: (form: CreateWarehouseForm) => void;
  onCreate: () => Promise<void>;
}

export default function CreateWarehouseDialog({
  form,
  zones,
  isLoadingZones,
  isCreating,
  onFormChange,
  onCreate,
}: CreateWarehouseDialogProps) {
  const [errors, setErrors] = useState<FormErrors<CreateWarehouseForm>>({});
  const [isOpen, setIsOpen] = useState(false);

  const clearFieldError = (field: keyof CreateWarehouseForm) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleCreate = async () => {
    const validationErrors = validateForm(warehouseSchema, form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    await onCreate();
    setErrors({});
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setErrors({});
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Add Warehouse
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Create New Warehouse</DialogTitle>
          <DialogDescription>Add a new warehouse location</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <FormField label="Warehouse Name" error={errors.name}>
            <Input
              value={form.name}
              onChange={(e) => {
                onFormChange({ ...form, name: e.target.value });
                clearFieldError("name");
              }}
              placeholder="e.g., South Warehouse"
              className="bg-background border-border"
            />
          </FormField>

          <FormField label="Address" error={errors.address}>
            <Input
              value={form.address}
              onChange={(e) => {
                onFormChange({ ...form, address: e.target.value });
                clearFieldError("address");
              }}
              placeholder="e.g., DHA Phase 2, Karachi"
              className="bg-background border-border"
            />
          </FormField>

          <FormField label="Zone" error={errors.zone_id}>
            <Select
              value={form.zone_id}
              onValueChange={(value) => {
                onFormChange({ ...form, zone_id: value });
                clearFieldError("zone_id");
              }}
              disabled={isLoadingZones}
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue
                  placeholder={
                    isLoadingZones ? "Loading zones..." : "Select Zone"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {zones.map((zone) => (
                  <SelectItem key={zone.id} value={String(zone.id)}>
                    {zone.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-primary text-primary-foreground"
            disabled={isCreating}
            onClick={handleCreate}
          >
            {isCreating ? "Creating..." : "Create Warehouse"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
