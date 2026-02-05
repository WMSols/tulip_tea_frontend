import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INVENTORY_MAX_HEIGHT } from "../../utils/constants";
import { getProductName } from "../../utils/formatters";
import type { WarehouseInventoryItem, Product, AddInventoryForm } from "../../types";

interface InventorySectionProps {
  inventory: WarehouseInventoryItem[];
  products: Product[];
  addInvForm: AddInventoryForm;
  editQty: Record<number, string>;
  isInventoryFetching: boolean;
  isAddingInventory: boolean;
  isUpdatingInventory: boolean;
  onAddFormChange: (form: AddInventoryForm) => void;
  onEditQtyChange: (itemId: number, value: string) => void;
  onAddInventory: () => void;
  onUpdateInventory: (item: WarehouseInventoryItem) => void;
}

export default function InventorySection({
  inventory,
  products,
  addInvForm,
  editQty,
  isInventoryFetching,
  isAddingInventory,
  isUpdatingInventory,
  onAddFormChange,
  onEditQtyChange,
  onAddInventory,
  onUpdateInventory,
}: InventorySectionProps) {
  return (
    <div className="pt-4 border-t border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="font-medium flex items-center gap-2">
          <Package className="w-4 h-4" />
          Inventory
        </div>
        <div className="text-xs text-muted-foreground">
          {isInventoryFetching ? "Refreshing..." : `${inventory.length} items`}
        </div>
      </div>

      {/* Add Inventory Form */}
      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <div className="sm:col-span-2 space-y-2">
          <Label>Product</Label>
          <Select
            value={addInvForm.product_id}
            onValueChange={(v) =>
              onAddFormChange({ ...addInvForm, product_id: v })
            }
          >
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {products.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {getProductName(p)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Quantity</Label>
          <Input
            type="number"
            value={addInvForm.quantity}
            onChange={(e) =>
              onAddFormChange({ ...addInvForm, quantity: e.target.value })
            }
            className="bg-background border-border"
            placeholder="0"
          />
        </div>

        <div className="sm:col-span-3">
          <Button
            className="bg-primary text-primary-foreground w-full"
            disabled={
              !addInvForm.product_id ||
              !addInvForm.quantity ||
              isAddingInventory
            }
            onClick={onAddInventory}
          >
            {isAddingInventory ? "Adding..." : "Add Inventory"}
          </Button>
        </div>
      </div>

      {/* Inventory List */}
      <div
        className="space-y-2 overflow-auto pr-1"
        style={{ maxHeight: INVENTORY_MAX_HEIGHT }}
      >
        {inventory.length === 0 ? (
          <div className="text-sm text-muted-foreground">No inventory yet.</div>
        ) : (
          inventory.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg border border-border bg-background/30 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
            >
              <div className="flex-1">
                <div className="font-medium">{item.product_name}</div>
                <div className="text-xs text-muted-foreground">
                  {item.item_name} • {item.unit} • Code: {item.product_code}/
                  {item.item_code}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  className="w-28 bg-background border-border"
                  defaultValue={item.quantity}
                  onChange={(e) => onEditQtyChange(item.id, e.target.value)}
                />
                <Button
                  variant="outline"
                  disabled={isUpdatingInventory}
                  onClick={() => onUpdateInventory(item)}
                >
                  {isUpdatingInventory ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
