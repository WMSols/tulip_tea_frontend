import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateWarehouseMutation,
  useAddWarehouseInventoryMutation,
  useUpdateWarehouseInventoryMutation,
  useAssignDeliveryManToWarehouseMutation,
  useRemoveDeliveryManFromWarehouseMutation,
} from "@/Redux/Api/warehousesApi";
import {
  validateWarehouseForm,
  validateInventoryForm,
  validateQuantity,
} from "../utils/helpers";
import { INITIAL_CREATE_FORM, INITIAL_INVENTORY_FORM } from "../utils/constants";
import type { CreateWarehouseForm, AddInventoryForm, WarehouseInventoryItem } from "../types";

interface UseWarehouseActionsReturn {
  // Create warehouse
  createForm: CreateWarehouseForm;
  setCreateForm: React.Dispatch<React.SetStateAction<CreateWarehouseForm>>;
  handleCreateWarehouse: () => Promise<void>;
  isCreating: boolean;

  // Inventory
  addInvForm: AddInventoryForm;
  setAddInvForm: React.Dispatch<React.SetStateAction<AddInventoryForm>>;
  editQty: Record<number, string>;
  setEditQty: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  handleAddInventory: (warehouseId: number) => Promise<void>;
  handleUpdateInventory: (warehouseId: number, item: WarehouseInventoryItem) => Promise<void>;
  isAddingInventory: boolean;
  isUpdatingInventory: boolean;

  // Delivery men
  assignDeliveryManId: string;
  setAssignDeliveryManId: React.Dispatch<React.SetStateAction<string>>;
  handleAssignDeliveryMan: (warehouseId: number, onSuccess?: () => void) => Promise<void>;
  handleRemoveDeliveryMan: (warehouseId: number, deliveryManId: number, onSuccess?: () => void) => Promise<void>;
  isAssigning: boolean;
  isRemoving: boolean;

  // Reset forms
  resetForms: () => void;
}

/**
 * Hook for warehouse CRUD operations
 */
export const useWarehouseActions = (): UseWarehouseActionsReturn => {
  const { toast } = useToast();

  const [createWarehouse, { isLoading: isCreating }] = useCreateWarehouseMutation();
  const [addInventory, { isLoading: isAddingInventory }] = useAddWarehouseInventoryMutation();
  const [updateInventory, { isLoading: isUpdatingInventory }] = useUpdateWarehouseInventoryMutation();
  const [assignDeliveryMan, { isLoading: isAssigning }] = useAssignDeliveryManToWarehouseMutation();
  const [removeDeliveryMan, { isLoading: isRemoving }] = useRemoveDeliveryManFromWarehouseMutation();

  // Form states
  const [createForm, setCreateForm] = useState<CreateWarehouseForm>(INITIAL_CREATE_FORM);
  const [addInvForm, setAddInvForm] = useState<AddInventoryForm>(INITIAL_INVENTORY_FORM);
  const [editQty, setEditQty] = useState<Record<number, string>>({});
  const [assignDeliveryManId, setAssignDeliveryManId] = useState<string>("");

  const resetForms = () => {
    setCreateForm(INITIAL_CREATE_FORM);
    setAddInvForm(INITIAL_INVENTORY_FORM);
    setEditQty({});
    setAssignDeliveryManId("");
  };

  const handleCreateWarehouse = async () => {
    const validation = validateWarehouseForm(createForm);
    
    if (!validation.valid) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: validation.error,
      });
      return;
    }

    try {
      await createWarehouse({
        name: createForm.name.trim(),
        address: createForm.address.trim(),
        zone_id: Number(createForm.zone_id),
      }).unwrap();

      toast({ title: "Warehouse created" });
      setCreateForm(INITIAL_CREATE_FORM);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Create failed",
        description: err?.data?.detail || "Unable to create warehouse.",
      });
    }
  };

  const handleAddInventory = async (warehouseId: number) => {
    const validation = validateInventoryForm(addInvForm);
    
    if (!validation.valid) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: validation.error,
      });
      return;
    }

    try {
      await addInventory({
        warehouse_id: warehouseId,
        body: {
          product_id: Number(addInvForm.product_id),
          quantity: Number(addInvForm.quantity),
        },
      }).unwrap();

      toast({ title: "Inventory added" });
      setAddInvForm(INITIAL_INVENTORY_FORM);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Add inventory failed",
        description: err?.data?.detail || "Unable to add inventory.",
      });
    }
  };

  const handleUpdateInventory = async (warehouseId: number, item: WarehouseInventoryItem) => {
    const nextQty = editQty[item.id];
    const validation = validateQuantity(nextQty);
    
    if (!validation.valid) {
      toast({
        variant: "destructive",
        title: "Invalid quantity",
        description: validation.error,
      });
      return;
    }

    try {
      await updateInventory({
        warehouse_id: warehouseId,
        inventory_id: item.id,
        body: {
          product_id: item.product_id,
          quantity: Number(nextQty),
        },
      }).unwrap();

      toast({ title: "Inventory updated" });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: err?.data?.detail || "Unable to update inventory.",
      });
    }
  };

  const handleAssignDeliveryMan = async (warehouseId: number, onSuccess?: () => void) => {
    const delivery_man_id = Number(assignDeliveryManId);
    
    if (Number.isNaN(delivery_man_id)) {
      toast({
        variant: "destructive",
        title: "Invalid selection",
        description: "Please select a delivery man.",
      });
      return;
    }

    try {
      await assignDeliveryMan({
        warehouse_id: warehouseId,
        delivery_man_id,
      }).unwrap();

      toast({ title: "Delivery man assigned" });
      setAssignDeliveryManId("");
      onSuccess?.();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Assign failed",
        description: err?.data?.detail || "Unable to assign delivery man.",
      });
    }
  };

  const handleRemoveDeliveryMan = async (
    warehouseId: number,
    deliveryManId: number,
    onSuccess?: () => void
  ) => {
    try {
      await removeDeliveryMan({
        warehouse_id: warehouseId,
        delivery_man_id: deliveryManId,
      }).unwrap();

      toast({ title: "Delivery man removed" });
      onSuccess?.();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Remove failed",
        description: err?.data?.detail || "Unable to remove delivery man.",
      });
    }
  };

  return {
    createForm,
    setCreateForm,
    handleCreateWarehouse,
    isCreating,
    addInvForm,
    setAddInvForm,
    editQty,
    setEditQty,
    handleAddInventory,
    handleUpdateInventory,
    isAddingInventory,
    isUpdatingInventory,
    assignDeliveryManId,
    setAssignDeliveryManId,
    handleAssignDeliveryMan,
    handleRemoveDeliveryMan,
    isAssigning,
    isRemoving,
    resetForms,
  };
};
