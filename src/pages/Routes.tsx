import { useState } from "react";
import { Plus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DeleteConfirmDialog } from "@/components/dashboard/DeleteConfirmDialog";
import { PageSkeleton } from "@/components/dashboard/PageSkeleton";
import { FormField } from "@/components/ui/FormField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
import {
  routeSchema,
  validateForm,
  type FormErrors,
} from "@/lib/validations";

interface RouteFormData {
  name: string;
  zone_id: string;
  order_booker_id: string;
}

export default function Routes() {
  const { toast } = useToast();
  const distributorId = useAppSelector((s) => s.auth.user.id);

  const { data: zones = [], isLoading: isLoadingZones } = useGetZonesQuery();

  const { data: orderBookers = [], isLoading: isLoadingOB } =
    useGetOrderBookersByDistributorQuery({
      distributor_id: distributorId,
    });

  const [zoneId, setZoneId] = useState<number | undefined>();
  const { data: routes = [], isLoading } = useGetRoutesQuery(
    zoneId
      ? { filterType: "zone", filterId: zoneId }
      : { filterType: "distributor", filterId: distributorId },
  );

  const isPageLoading = isLoadingZones || isLoadingOB || isLoading;

  const [createRoute, { isLoading: isCreating }] = useCreateRouteMutation();
  const [updateRoute, { isLoading: isUpdating }] = useUpdateRouteMutation();
  const [deleteRoute, { isLoading: isDeleting }] = useDeleteRouteMutation();
  const [assignRoute] = useAssignRouteMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [errors, setErrors] = useState<FormErrors<RouteFormData>>({});

  const [formData, setFormData] = useState<RouteFormData>({
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
    setErrors({});
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
    setErrors({});
    setIsDialogOpen(true);
  };

  const clearFieldError = (field: keyof RouteFormData) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(routeSchema, formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const body: CreateRouteRequest | UpdateRouteRequest = {
        name: formData.name,
        zone_id: Number(formData.zone_id),

        ...(formData.order_booker_id && {
          order_booker_id: Number(formData.order_booker_id),
        }),
      };

      if (editingRoute) {
        await updateRoute({
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
      setErrors({});
    } catch (error: any) {
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

  if (isPageLoading) {
    return (
      <PageSkeleton
        statCards={0}
        tableColumns={4}
        tableRows={6}
        showHeader
      />
    );
  }

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

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setErrors({});
        }}
      >
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
            <FormField label="Route Name" error={errors.name}>
              <Input
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  clearFieldError("name");
                }}
                placeholder="Enter route name"
              />
            </FormField>

            <FormField label="Zone" error={errors.zone_id}>
              <Select
                value={formData.zone_id}
                onValueChange={(value) => {
                  setFormData({ ...formData, zone_id: value });
                  clearFieldError("zone_id");
                }}
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
            </FormField>

            <FormField label="Order Booker" optional>
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
            </FormField>
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
