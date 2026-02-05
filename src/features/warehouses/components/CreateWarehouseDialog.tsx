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
import { Label } from "@/components/ui/label";
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
  return (
    <Dialog>
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
          <div className="space-y-2">
            <Label>Warehouse Name</Label>
            <Input
              value={form.name}
              onChange={(e) =>
                onFormChange({ ...form, name: e.target.value })
              }
              placeholder="e.g., South Warehouse"
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              value={form.address}
              onChange={(e) =>
                onFormChange({ ...form, address: e.target.value })
              }
              placeholder="e.g., DHA Phase 2, Karachi"
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label>Zone</Label>
            <Select
              value={form.zone_id}
              onValueChange={(value) =>
                onFormChange({ ...form, zone_id: value })
              }
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
          </div>
        </div>

        <DialogFooter>
          <Button
            className="bg-primary text-primary-foreground"
            disabled={isCreating}
            onClick={onCreate}
          >
            {isCreating ? "Creating..." : "Create Warehouse"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
