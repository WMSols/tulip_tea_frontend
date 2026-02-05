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
import DeliveryMenSection from "./DeliveryMenSection";
import InventorySection from "./InventorySection";
import type {
  Warehouse,
  Zone,
  WarehouseInventoryItem,
  WarehouseDeliveryMan,
  DeliveryMan,
  Product,
  AddInventoryForm,
} from "../../types";

interface ManageWarehouseDialogProps {
  isOpen: boolean;
  warehouse: Warehouse | null;
  zone: Zone | null;
  inventory: WarehouseInventoryItem[];
  assignedDeliveryMen: WarehouseDeliveryMan[];
  availableDeliveryMen: DeliveryMan[];
  products: Product[];
  addInvForm: AddInventoryForm;
  editQty: Record<number, string>;
  assignDeliveryManId: string;
  isInventoryFetching: boolean;
  isAssignedFetching: boolean;
  isAddingInventory: boolean;
  isUpdatingInventory: boolean;
  isAssigning: boolean;
  isRemoving: boolean;
  onClose: () => void;
  onAddFormChange: (form: AddInventoryForm) => void;
  onEditQtyChange: (itemId: number, value: string) => void;
  onAssignIdChange: (id: string) => void;
  onAddInventory: () => void;
  onUpdateInventory: (item: WarehouseInventoryItem) => void;
  onAssignDeliveryMan: () => void;
  onRequestRemove: (dm: WarehouseDeliveryMan) => void;
}

export default function ManageWarehouseDialog({
  isOpen,
  warehouse,
  zone,
  inventory,
  assignedDeliveryMen,
  availableDeliveryMen,
  products,
  addInvForm,
  editQty,
  assignDeliveryManId,
  isInventoryFetching,
  isAssignedFetching,
  isAddingInventory,
  isUpdatingInventory,
  isAssigning,
  isRemoving,
  onClose,
  onAddFormChange,
  onEditQtyChange,
  onAssignIdChange,
  onAddInventory,
  onUpdateInventory,
  onAssignDeliveryMan,
  onRequestRemove,
}: ManageWarehouseDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Manage Warehouse</DialogTitle>
          <DialogDescription>
            Inventory and delivery-men assignment for:{" "}
            <span className="font-medium">{warehouse?.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {/* Warehouse Basic Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input
                value={warehouse?.name ?? ""}
                readOnly
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-1">
              <Label>Zone</Label>
              <Input
                value={zone ? zone.name : warehouse?.zone_id ?? ""}
                readOnly
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label>Address</Label>
              <Input
                value={warehouse?.address ?? ""}
                readOnly
                className="bg-background border-border"
              />
            </div>
          </div>

          {/* Delivery Men Section */}
          <DeliveryMenSection
            assignedDeliveryMen={assignedDeliveryMen}
            availableDeliveryMen={availableDeliveryMen}
            assignDeliveryManId={assignDeliveryManId}
            isAssignedFetching={isAssignedFetching}
            isAssigning={isAssigning}
            isRemoving={isRemoving}
            onAssignIdChange={onAssignIdChange}
            onAssign={onAssignDeliveryMan}
            onRequestRemove={onRequestRemove}
          />

          {/* Inventory Section */}
          <InventorySection
            inventory={inventory}
            products={products}
            addInvForm={addInvForm}
            editQty={editQty}
            isInventoryFetching={isInventoryFetching}
            isAddingInventory={isAddingInventory}
            isUpdatingInventory={isUpdatingInventory}
            onAddFormChange={onAddFormChange}
            onEditQtyChange={onEditQtyChange}
            onAddInventory={onAddInventory}
            onUpdateInventory={onUpdateInventory}
          />
        </div>

        <DialogFooter className="shrink-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
