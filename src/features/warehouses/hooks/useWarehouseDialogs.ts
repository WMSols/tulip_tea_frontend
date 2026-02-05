import { useState } from "react";
import {
  useGetWarehouseInventoryQuery,
  useGetWarehouseDeliveryMenQuery,
} from "@/Redux/Api/warehousesApi";
import { findZoneById } from "../utils/helpers";
import type {
  Warehouse,
  Zone,
  WarehouseInventoryItem,
  WarehouseDeliveryMan,
  ManageDialogData,
} from "../types";

interface UseWarehouseDialogsReturn {
  // Manage dialog
  isManageOpen: boolean;
  selectedWarehouse: Warehouse | null;
  selectedZone: Zone | null;
  handleOpenManage: (warehouse: Warehouse) => void;
  handleCloseManage: () => void;

  // Inventory data
  inventory: WarehouseInventoryItem[];
  isInventoryFetching: boolean;

  // Delivery men data
  assignedDeliveryMen: WarehouseDeliveryMan[];
  isAssignedFetching: boolean;
  refetchAssignedDeliveryMen: () => void;

  // Remove confirmation
  isRemoveConfirmOpen: boolean;
  pendingRemove: WarehouseDeliveryMan | null;
  handleRequestRemove: (dm: WarehouseDeliveryMan) => void;
  handleCancelRemove: () => void;
  handleConfirmRemove: (onConfirm: () => Promise<void>) => Promise<void>;
}

/**
 * Hook for managing warehouse dialog states
 */
export const useWarehouseDialogs = (zones: Zone[]): UseWarehouseDialogsReturn => {
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<WarehouseDeliveryMan | null>(null);

  const selectedZone = findZoneById(zones, selectedWarehouse?.zone_id);

  const { data: inventory = [], isFetching: isInventoryFetching } =
    useGetWarehouseInventoryQuery(
      { warehouse_id: selectedWarehouse?.id ?? 0 },
      { skip: !selectedWarehouse?.id || !isManageOpen }
    );

  const {
    data: assignedDeliveryMen = [],
    isFetching: isAssignedFetching,
    refetch: refetchAssignedDeliveryMen,
  } = useGetWarehouseDeliveryMenQuery(
    { warehouse_id: selectedWarehouse?.id ?? 0 },
    { skip: !selectedWarehouse?.id || !isManageOpen }
  );

  const handleOpenManage = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsManageOpen(true);
    setPendingRemove(null);
    setIsRemoveConfirmOpen(false);
  };

  const handleCloseManage = () => {
    setIsManageOpen(false);
    setPendingRemove(null);
    setIsRemoveConfirmOpen(false);
  };

  const handleRequestRemove = (dm: WarehouseDeliveryMan) => {
    setPendingRemove(dm);
    setIsRemoveConfirmOpen(true);
  };

  const handleCancelRemove = () => {
    setIsRemoveConfirmOpen(false);
    setPendingRemove(null);
  };

  const handleConfirmRemove = async (onConfirm: () => Promise<void>) => {
    await onConfirm();
    setIsRemoveConfirmOpen(false);
    setPendingRemove(null);
  };

  return {
    isManageOpen,
    selectedWarehouse,
    selectedZone: selectedZone ?? null,
    handleOpenManage,
    handleCloseManage,
    inventory,
    isInventoryFetching,
    assignedDeliveryMen,
    isAssignedFetching,
    refetchAssignedDeliveryMen,
    isRemoveConfirmOpen,
    pendingRemove,
    handleRequestRemove,
    handleCancelRemove,
    handleConfirmRemove,
  };
};
