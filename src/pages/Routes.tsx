import { useState } from "react";
import { Plus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DeleteConfirmDialog } from "@/components/dashboard/DeleteConfirmDialog";
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
  useGetRoutesQuery,
  useCreateRouteMutation,
  useDeleteRouteMutation,
  useAssignRouteMutation,
  useUpdateRouteMutation,
} from "@/Redux/Api/routesApi";
import { useGetZonesQuery } from "@/Redux/Api/zonesApi";
import { useGetOrderBookersByDistributorQuery } from "@/Redux/Api/orderBookerApi";
import type { Route } from "@/types/routes";
import { useAppSelector } from "@/Redux/Hooks/hooks";
import type { CreateRouteRequest, UpdateRouteRequest } from "@/types/routes";
import { Zone } from "@/types/zones";
import { OrderBooker } from "@/types/staff";

export default function Routes() {
  const { toast } = useToast();
  const distributorId = useAppSelector((s) => s.auth.user.id);

  const { data: zones = [], isLoading: isLoadingZones } = useGetZonesQuery();

  const { data: orderBookers = [] } = useGetOrderBookersByDistributorQuery({
    distributor_id: distributorId,
  });

  const [zoneId, setZoneId] = useState<number | undefined>();
  const { data: routes = [], isLoading } = useGetRoutesQuery(
    zoneId
      ? { filterType: "zone", filterId: zoneId }
      : { filterType: "distributor", filterId: distributorId },
  );

  const [createRoute, { isLoading: isCreating }] = useCreateRouteMutation();
  const [updateRoute, { isLoading: isUpdating }] = useUpdateRouteMutation();
  const [deleteRoute, { isLoading: isDeleting }] = useDeleteRouteMutation();
  const [assignRoute] = useAssignRouteMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    zone_id: "",
    order_booker_id: "",
  });

  const zoneMap = new Map<number, string>(
    zones.map((z: Zone) => [z.id, z.name]),
  );

  const orderBookerMap = new Map<number, string>(
    orderBookers.map((ob: OrderBooker) => [ob.id, ob.name]),
  );

  const openCreateDialog = () => {
    setEditingRoute(null);
    setFormData({ name: "", zone_id: "", order_booker_id: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (route: Route) => {
    setEditingRoute(route);
    setFormData({
      name: route.name,
      zone_id: String(route.zone_id),
      order_booker_id: route.order_booker_id
        ? String(route.order_booker_id)
        : "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const body: CreateRouteRequest | UpdateRouteRequest = {
        name: formData.name,
        zone_id: Number(formData.zone_id),

        ...(formData.order_booker_id && {
          order_booker_id: Number(formData.order_booker_id),
        }),
      };

      if (editingRoute) {
        const res = await updateRoute({
          route_id: editingRoute.id,
          body: body as UpdateRouteRequest,
        }).unwrap();
        toast({ title: "Route Updated" });
      } else {
        await createRoute({
          distributor_id: distributorId,
          body: body as CreateRouteRequest,
        }).unwrap();
        toast({ title: "Route Created" });
      }

      setIsDialogOpen(false);
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error",
        description: error?.data?.detail || "Operation failed",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRoute = async (routeId: number) => {
    try {
      await deleteRoute(routeId).unwrap();
      toast({ title: "Route Deleted" });
    } catch (error: any) {
      console.error("Delete route error:", error);
      toast({
        title: "Error",
        description: error?.data?.detail || "Failed to delete route",
        variant: "destructive",
      });
    }
  };

  const columns = [
    { key: "id", label: "ID", sortable: true },

    { key: "name", label: "Route Name", sortable: true },

    {
      key: "zone_id",
      label: "Zone",
      render: (r: Route) => (
        <StatusBadge
          status="info"
          label={zoneMap.get(r.zone_id) ?? `Zone ${r.zone_id}`}
        />
      ),
    },

    {
      key: "order_booker_id",
      label: "Order Booker",
      render: (r: Route) =>
        r.order_booker_id
          ? (orderBookerMap.get(r.order_booker_id) ??
            `OB #${r.order_booker_id}`)
          : "Unassigned",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Routes</h1>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Filter by Zone ID"
            value={zoneId ?? ""}
            onChange={(e) =>
              setZoneId(e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-40"
          />

          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-1" /> Add Route
          </Button>
        </div>
      </div>

      <DataTable
        data={routes}
        columns={columns}
        actions={(route) => (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openEditDialog(route)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>

            <DeleteConfirmDialog
              onConfirm={() => handleDeleteRoute(route.id)}
              loading={isDeleting}
            />
          </div>
        )}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRoute ? "Update Route" : "Create Route"}
            </DialogTitle>
            <DialogDescription>
              {editingRoute
                ? "Update route details"
                : "Fill details to create a route"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Label>Route Name</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <Label>Zone</Label>
            <Select
              value={formData.zone_id}
              onValueChange={(value) =>
                setFormData({ ...formData, zone_id: value })
              }
              disabled={isLoadingZones}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Zone" />
              </SelectTrigger>

              <SelectContent>
                {zones.map((zone: Zone) => (
                  <SelectItem key={zone.id} value={String(zone.id)}>
                    {zone.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label>Order Booker</Label>
            <Select
              value={formData.order_booker_id}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  order_booker_id: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Order Booker (Optional)" />
              </SelectTrigger>

              <SelectContent>
                {orderBookers.map((ob: OrderBooker) => (
                  <SelectItem key={ob.id} value={String(ob.id)}>
                    {ob.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isCreating || isUpdating}>
              {editingRoute
                ? isUpdating
                  ? "Updating..."
                  : "Update Route"
                : isCreating
                  ? "Creating..."
                  : "Create Route"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
