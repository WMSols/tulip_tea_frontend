import { useAppSelector } from "@/Redux/Hooks/hooks";
import WarehousesHeader from "@/features/warehouses/components/WarehousesHeader";
import WarehousesStats from "@/features/warehouses/components/WarehousesStats";
import WarehousesGrid from "@/features/warehouses/components/WarehousesGrid";
import CreateWarehouseDialog from "@/features/warehouses/components/CreateWarehouseDialog";
import ManageWarehouseDialog from "@/features/warehouses/components/ManageDialog";
import RemoveConfirmDialog from "@/features/warehouses/components/RemoveConfirmDialog";
import { useWarehousesData } from "@/features/warehouses/hooks/useWarehousesData";
import { useWarehouseActions } from "@/features/warehouses/hooks/useWarehouseActions";
import { useWarehouseDialogs } from "@/features/warehouses/hooks/useWarehouseDialogs";

export default function Warehouses() {
  // Get distributor ID from Redux
  const distributorId =
    useAppSelector((s) => (s.auth.user as any)?.distributor_id) ??
    useAppSelector((s) => (s.auth.user as any)?.distributorId) ??
    useAppSelector((s) => (s.auth.user as any)?.id);

  // Fetch data
  const {
    warehouses,
    zones,
    products,
    deliveryMen,
    stats,
    isLoading,
    isLoadingZones,
  } = useWarehousesData(distributorId);

  // Actions
  const {
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
  } = useWarehouseActions();

  // Dialogs
  const {
    isManageOpen,
    selectedWarehouse,
    selectedZone,
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
  } = useWarehouseDialogs(zones);

  // Wrapper functions
  const onManageClose = () => {
    handleCloseManage();
    resetForms();
  };

  const onAddInventory = () => {
    if (!selectedWarehouse?.id) return;
    handleAddInventory(selectedWarehouse.id);
  };

  const onUpdateInventory = (item: any) => {
    if (!selectedWarehouse?.id) return;
    handleUpdateInventory(selectedWarehouse.id, item);
  };

  const onAssignDeliveryMan = () => {
    if (!selectedWarehouse?.id) return;
    handleAssignDeliveryMan(selectedWarehouse.id, refetchAssignedDeliveryMen);
  };

  const onConfirmRemove = async () => {
    if (!selectedWarehouse?.id || !pendingRemove?.id) return;
    await handleConfirmRemove(() =>
      handleRemoveDeliveryMan(
        selectedWarehouse.id,
        pendingRemove.id,
        refetchAssignedDeliveryMen,
      ),
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Create button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <WarehousesHeader />
        <CreateWarehouseDialog
          form={createForm}
          zones={zones}
          isLoadingZones={isLoadingZones}
          isCreating={isCreating}
          onFormChange={setCreateForm}
          onCreate={handleCreateWarehouse}
        />
      </div>

      {/* Stats */}
      <WarehousesStats stats={stats} />

      {/* Warehouses Grid */}
      <WarehousesGrid
        warehouses={warehouses}
        isLoading={isLoading}
        onManage={handleOpenManage}
      />

      {/* Manage Dialog */}
      <ManageWarehouseDialog
        isOpen={isManageOpen}
        warehouse={selectedWarehouse}
        zone={selectedZone}
        inventory={inventory}
        assignedDeliveryMen={assignedDeliveryMen}
        availableDeliveryMen={deliveryMen}
        products={products}
        addInvForm={addInvForm}
        editQty={editQty}
        assignDeliveryManId={assignDeliveryManId}
        isInventoryFetching={isInventoryFetching}
        isAssignedFetching={isAssignedFetching}
        isAddingInventory={isAddingInventory}
        isUpdatingInventory={isUpdatingInventory}
        isAssigning={isAssigning}
        isRemoving={isRemoving}
        onClose={onManageClose}
        onAddFormChange={setAddInvForm}
        onEditQtyChange={(itemId, value) =>
          setEditQty((p) => ({ ...p, [itemId]: value }))
        }
        onAssignIdChange={setAssignDeliveryManId}
        onAddInventory={onAddInventory}
        onUpdateInventory={onUpdateInventory}
        onAssignDeliveryMan={onAssignDeliveryMan}
        onRequestRemove={handleRequestRemove}
      />

      {/* Remove Confirmation Dialog */}
      <RemoveConfirmDialog
        isOpen={isRemoveConfirmOpen}
        deliveryMan={pendingRemove}
        isRemoving={isRemoving}
        onCancel={handleCancelRemove}
        onConfirm={onConfirmRemove}
      />
    </div>
  );
}
