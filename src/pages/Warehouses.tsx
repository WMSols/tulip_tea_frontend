import { useMemo, useState } from "react";
import {
  Plus,
  Edit2,
  Warehouse as WarehouseIcon,
  Package,
  Users,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
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
import { useToast } from "@/hooks/use-toast";

import {
  useCreateWarehouseMutation,
  useGetWarehouseInventoryQuery,
  useGetWarehousesQuery,
  useAddWarehouseInventoryMutation,
  useUpdateWarehouseInventoryMutation,
  useAssignDeliveryManToWarehouseMutation,
  useRemoveDeliveryManFromWarehouseMutation,
  useGetWarehouseDeliveryMenQuery,
} from "@/Redux/Api/warehousesApi";
import { useGetZonesQuery } from "@/Redux/Api/zonesApi";

import { useGetProductsQuery } from "@/Redux/Api/productsApi";
import { useGetDeliveryMenByDistributorQuery } from "@/Redux/Api/deliveryManApi";
import { useAppSelector } from "@/Redux/Hooks/hooks";
import type {
  Warehouse,
  WarehouseInventoryItem,
  WarehouseDeliveryMan,
} from "@/types/warehouse";
import { Zone } from "@/types/zones";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Warehouses() {
  const { toast } = useToast();

  const { data: warehouses = [], isLoading: isWarehousesLoading } =
    useGetWarehousesQuery();

  const { data: zones = [], isLoading: isLoadingZones } = useGetZonesQuery();

  const [createWarehouse, { isLoading: isCreating }] =
    useCreateWarehouseMutation();

  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null,
  );
  const selectedZone = zones.find(
    (z: Zone) => z.id === selectedWarehouse?.zone_id,
  );
  const [isManageOpen, setIsManageOpen] = useState(false);

  const { data: products = [] } = useGetProductsQuery();

  // Best-effort distributor_id resolution (adjust to your actual user shape)
  const distributorId =
    useAppSelector((s) => (s.auth.user as any)?.distributor_id) ??
    useAppSelector((s) => (s.auth.user as any)?.distributorId) ??
    useAppSelector((s) => (s.auth.user as any)?.id);

  const { data: deliveryMen = [] } = useGetDeliveryMenByDistributorQuery(
    { distributor_id: distributorId },
    { skip: !distributorId },
  );

  const { data: inventory = [], isFetching: isInventoryFetching } =
    useGetWarehouseInventoryQuery(
      { warehouse_id: selectedWarehouse?.id ?? 0 },
      { skip: !selectedWarehouse?.id || !isManageOpen },
    );

  // ✅ Assigned delivery-men list from: GET /warehouses/{warehouse_id}/delivery-men
  const {
    data: assignedDeliveryMen = [],
    isFetching: isAssignedFetching,
    refetch: refetchAssignedDeliveryMen,
  } = useGetWarehouseDeliveryMenQuery(
    { warehouse_id: selectedWarehouse?.id ?? 0 },
    { skip: !selectedWarehouse?.id || !isManageOpen },
  );

  const [addInventory, { isLoading: isAddingInventory }] =
    useAddWarehouseInventoryMutation();
  const [updateInventory, { isLoading: isUpdatingInventory }] =
    useUpdateWarehouseInventoryMutation();

  const [assignDeliveryMan, { isLoading: isAssigning }] =
    useAssignDeliveryManToWarehouseMutation();
  const [removeDeliveryMan, { isLoading: isRemoving }] =
    useRemoveDeliveryManFromWarehouseMutation();

  // Create form
  const [createForm, setCreateForm] = useState<{
    name: string;
    zone_id: string;
    address: string;
  }>({
    name: "",
    zone_id: "",
    address: "",
  });

  // Manage dialog forms
  const [assignDeliveryManId, setAssignDeliveryManId] = useState<string>("");

  const [addInvForm, setAddInvForm] = useState<{
    product_id: string;
    quantity: string;
  }>({
    product_id: "",
    quantity: "",
  });

  const [editQty, setEditQty] = useState<Record<number, string>>({});

  // ✅ Delete confirm dialog state for removing assigned delivery man
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);
  const [pendingRemove, setPendingRemove] =
    useState<WarehouseDeliveryMan | null>(null);

  const stats = useMemo(() => {
    const active = warehouses.filter((w) => w.is_active).length;
    const inactive = warehouses.length - active;
    const zones = new Set(warehouses.map((w) => w.zone_id)).size;
    return { active, inactive, zones };
  }, [warehouses]);

  const openManage = (w: Warehouse) => {
    setSelectedWarehouse(w);
    setIsManageOpen(true);
    setAssignDeliveryManId("");
    setAddInvForm({ product_id: "", quantity: "" });
    setEditQty({});
    setPendingRemove(null);
    setIsRemoveConfirmOpen(false);
  };

  const onCreateWarehouse = async () => {
    const zone_id = Number(createForm.zone_id);

    if (
      !createForm.name.trim() ||
      !createForm.address.trim() ||
      Number.isNaN(zone_id)
    ) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please provide name, address, and a valid zone_id.",
      });
      return;
    }

    try {
      await createWarehouse({
        name: createForm.name.trim(),
        address: createForm.address.trim(),
        zone_id,
      }).unwrap();

      toast({ title: "Warehouse created" });
      setCreateForm({ name: "", zone_id: "", address: "" });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Create failed",
        description: err?.data?.detail || "Unable to create warehouse.",
      });
    }
  };

  const onAddInventory = async () => {
    if (!selectedWarehouse?.id) return;

    const product_id = Number(addInvForm.product_id);
    const quantity = Number(addInvForm.quantity);

    if (Number.isNaN(product_id) || Number.isNaN(quantity)) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Select a product and enter a valid quantity.",
      });
      return;
    }

    try {
      await addInventory({
        warehouse_id: selectedWarehouse.id,
        body: { product_id, quantity },
      }).unwrap();

      toast({ title: "Inventory added" });
      setAddInvForm({ product_id: "", quantity: "" });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Add inventory failed",
        description: err?.data?.detail || "Unable to add inventory.",
      });
    }
  };

  const onUpdateInventory = async (item: WarehouseInventoryItem) => {
    if (!selectedWarehouse?.id) return;

    const nextQty = editQty[item.id];
    const quantity = Number(nextQty);

    if (nextQty == null || nextQty === "" || Number.isNaN(quantity)) {
      toast({
        variant: "destructive",
        title: "Invalid quantity",
        description: "Enter a valid quantity before updating.",
      });
      return;
    }

    try {
      await updateInventory({
        warehouse_id: selectedWarehouse.id,
        inventory_id: item.id,
        body: { product_id: item.product_id, quantity },
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

  const onAssign = async () => {
    if (!selectedWarehouse?.id) return;

    const delivery_man_id = Number(assignDeliveryManId);
    if (Number.isNaN(delivery_man_id)) return;

    try {
      await assignDeliveryMan({
        warehouse_id: selectedWarehouse.id,
        delivery_man_id,
      }).unwrap();

      toast({ title: "Delivery man assigned" });
      setAssignDeliveryManId("");

      // In case invalidation isn't wired, keep UI fresh
      refetchAssignedDeliveryMen();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Assign failed",
        description: err?.data?.detail || "Unable to assign delivery man.",
      });
    }
  };

  const requestRemove = (dm: WarehouseDeliveryMan) => {
    setPendingRemove(dm);
    setIsRemoveConfirmOpen(true);
  };

  const confirmRemove = async () => {
    if (!selectedWarehouse?.id || !pendingRemove?.id) return;

    try {
      await removeDeliveryMan({
        warehouse_id: selectedWarehouse.id,
        delivery_man_id: pendingRemove.id,
      }).unwrap();

      toast({ title: "Delivery man removed" });
      setIsRemoveConfirmOpen(false);
      setPendingRemove(null);

      refetchAssignedDeliveryMen();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Remove failed",
        description: err?.data?.detail || "Unable to remove delivery man.",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Warehouses & Inventory
          </h1>
          <p className="text-muted-foreground">
            Manage warehouses, stock, and deliveries
          </p>
        </div>

        {/* Create Warehouse */}
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
              <DialogDescription>
                Add a new warehouse location
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Warehouse Name</Label>
                <Input
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g., South Warehouse"
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={createForm.address}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, address: e.target.value }))
                  }
                  placeholder="e.g., DHA Phase 2, Karachi"
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label>Zone</Label>

                <Select
                  value={createForm.zone_id ? String(createForm.zone_id) : ""}
                  onValueChange={(value) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      zone_id: value,
                    }))
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
                    {zones.map((zone: any) => (
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
                onClick={onCreateWarehouse}
              >
                {isCreating ? "Creating..." : "Create Warehouse"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <WarehouseIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{warehouses.length}</p>
              <p className="text-sm text-muted-foreground">Warehouses</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Users className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Users className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.inactive}</p>
              <p className="text-sm text-muted-foreground">Inactive</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <MapPin className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.zones}</p>
              <p className="text-sm text-muted-foreground">Zones (by id)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Warehouses List */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {isWarehousesLoading ? (
          <div className="text-muted-foreground">Loading warehouses...</div>
        ) : (
          warehouses.map((w) => (
            <div key={w.id} className="stat-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <WarehouseIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{w.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {w.address}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      <StatusBadge status="info" label={`Zone #${w.zone_id}`} />
                      <StatusBadge
                        status={w.is_active ? "success" : "warning"}
                        label={w.is_active ? "Active" : "Inactive"}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openManage(w)}
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Created:{" "}
                  {w.created_at
                    ? new Date(w.created_at).toLocaleDateString()
                    : "—"}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary"
                  onClick={() => openManage(w)}
                >
                  Manage
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Manage (Edit) Dialog */}
      <Dialog
        open={isManageOpen}
        onOpenChange={(open) => {
          setIsManageOpen(open);
          if (!open) {
            setPendingRemove(null);
            setIsRemoveConfirmOpen(false);
          }
        }}
      >
        {/* ✅ Scrollable dialog when content grows */}
        <DialogContent className="bg-card border-border max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>Manage Warehouse</DialogTitle>
            <DialogDescription>
              Inventory and delivery-men assignment for:{" "}
              <span className="font-medium">{selectedWarehouse?.name}</span>
            </DialogDescription>
          </DialogHeader>

          {/* ✅ Body scroll */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {/* Warehouse info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input
                  value={selectedWarehouse?.name ?? ""}
                  readOnly
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-1">
                <Label>Zone</Label>

                <Input
                  value={
                    selectedZone
                      ? selectedZone.name
                      : (selectedWarehouse?.zone_id ?? "")
                  }
                  readOnly
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label>Address</Label>
                <Input
                  value={selectedWarehouse?.address ?? ""}
                  readOnly
                  className="bg-background border-border"
                />
              </div>
            </div>

            {/* Delivery Men */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Delivery Staff
                </div>
                <div className="text-xs text-muted-foreground">
                  {isAssignedFetching
                    ? "Refreshing..."
                    : `${assignedDeliveryMen.length} assigned`}
                </div>
              </div>

              {/* Assign */}
              <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
                <div className="space-y-2">
                  <Label>Assign Delivery Man</Label>
                  <Select
                    value={assignDeliveryManId}
                    onValueChange={setAssignDeliveryManId}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select delivery man" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {deliveryMen.map((dm: any) => (
                        <SelectItem key={dm.id} value={String(dm.id)}>
                          {dm.name ?? dm.full_name ?? `DeliveryMan #${dm.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  disabled={!assignDeliveryManId || isAssigning}
                  onClick={onAssign}
                  className="bg-primary text-primary-foreground"
                >
                  {isAssigning ? "Assigning..." : "Assign"}
                </Button>
              </div>

              {/* Assigned list with remove */}
              <div className="mt-4 space-y-2">
                <Label>Assigned Delivery Men</Label>

                {assignedDeliveryMen.length === 0 ? (
                  <div className="text-sm text-muted-foreground italic">
                    None assigned
                  </div>
                ) : (
                  <div className="space-y-2">
                    {assignedDeliveryMen.map((dm) => (
                      <div
                        key={dm.id}
                        className="p-3 rounded-lg border border-border bg-background/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status="success" label={dm.name} />
                            <span className="text-xs text-muted-foreground">
                              ID: {dm.id}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Zone: {dm.zone_id}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Phone: {dm.phone} • Assigned:{" "}
                            {dm.assigned_at
                              ? new Date(dm.assigned_at).toLocaleString()
                              : "—"}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          disabled={isRemoving}
                          onClick={() => requestRemove(dm)}
                          className="sm:self-center"
                        >
                          {isRemoving ? "Removing..." : "Remove"}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Inventory */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Inventory
                </div>
                <div className="text-xs text-muted-foreground">
                  {isInventoryFetching
                    ? "Refreshing..."
                    : `${inventory.length} items`}
                </div>
              </div>

              {/* Add Inventory */}
              <div className="grid sm:grid-cols-3 gap-3 mb-4">
                <div className="sm:col-span-2 space-y-2">
                  <Label>Product</Label>
                  <Select
                    value={addInvForm.product_id}
                    onValueChange={(v) =>
                      setAddInvForm((p) => ({ ...p, product_id: v }))
                    }
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {products.map((p: any) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.name ?? p.product_name ?? `Product #${p.id}`}
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
                      setAddInvForm((p) => ({
                        ...p,
                        quantity: e.target.value,
                      }))
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

              {/* Inventory list */}
              <div className="space-y-2 max-h-[320px] overflow-auto pr-1">
                {inventory.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No inventory yet.
                  </div>
                ) : (
                  inventory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg border border-border bg-background/30 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{item.product_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.item_name} • {item.unit} • Code:{" "}
                          {item.product_code}/{item.item_code}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          className="w-28 bg-background border-border"
                          defaultValue={item.quantity}
                          onChange={(e) =>
                            setEditQty((p) => ({
                              ...p,
                              [item.id]: e.target.value,
                            }))
                          }
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
          </div>

          <DialogFooter className="shrink-0">
            <Button variant="outline" onClick={() => setIsManageOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog
        open={isRemoveConfirmOpen}
        onOpenChange={setIsRemoveConfirmOpen}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove delivery man?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingRemove
                ? `Remove "${pendingRemove.name}" (ID: ${pendingRemove.id}) from this warehouse?`
                : "Remove selected delivery man from this warehouse?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isRemoving} onClick={confirmRemove}>
              {isRemoving ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
