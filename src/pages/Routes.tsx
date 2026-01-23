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
} from "@/Redux/Api/routesApi";
import type { Route } from "@/types/routes";
import { useAppSelector } from "@/Redux/Hooks/hooks";

export default function Routes() {
  const { toast } = useToast();

  const distributorId = useAppSelector((state) => state.auth.user.id);

  const [zoneId, setZoneId] = useState<number | undefined>();

  const { data: routes = [], isLoading } = useGetRoutesQuery(
    zoneId
      ? { filterType: "zone", filterId: zoneId }
      : { filterType: "distributor", filterId: distributorId },
  );

  const [createRoute, { isLoading: isCreating }] = useCreateRouteMutation();
  const [deleteRoute, { isLoading: isDeleting }] = useDeleteRouteMutation();
  const [assignRoute] = useAssignRouteMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    zone_id: "",
    order_booker_id: "",
  });

  const handleSubmit = async () => {
    try {
      const res = await createRoute({
        distributor_id: distributorId,
        body: {
          name: formData.name,
          zone_id: Number(formData.zone_id),
        },
      }).unwrap();
      console.log(res);

      toast({ title: "Route Created" });

      setIsDialogOpen(false);
      setFormData({ name: "", zone_id: "", order_booker_id: "" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to create route",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRoute(id).unwrap();
      toast({ title: "Route Deleted" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete route",
        variant: "destructive",
      });
    }
  };

  const handleAssign = async (route: Route) => {
    if (!formData.order_booker_id) return;

    try {
      await assignRoute({
        route_id: route.id,
        order_booker_id: Number(formData.order_booker_id),
      }).unwrap();

      toast({ title: "Route Assigned" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to assign route",
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
        <StatusBadge status="info" label={`Zone ${r.zone_id}`} />
      ),
    },
    {
      key: "order_booker_id",
      label: "Order Booker",
      render: (r: Route) =>
        r.order_booker_id ? (
          <span className="font-medium">OB #{r.order_booker_id}</span>
        ) : (
          <span className="text-muted-foreground italic">Unassigned</span>
        ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (r: Route) => new Date(r.created_at).toLocaleDateString(),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loader" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header + Filters */}
      <div className="flex flex-wrap items-end gap-3 justify-between">
        <div>
          <h1 className="text-2xl font-bold">Routes</h1>
          <p className="text-sm text-muted-foreground">
            Manage delivery routes
          </p>
        </div>

        {/* Filters + Add button */}
        <div className="flex flex-wrap items-end gap-3 w-full sm:w-auto">
          <Input
            type="number"
            placeholder="Enter Zone ID..."
            value={zoneId ?? ""}
            onChange={(e) =>
              setZoneId(e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-40"
          />

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={isCreating} className="ml-0 sm:ml-2">
                <Plus className="w-4 h-4 mr-1" /> Add Route
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Route</DialogTitle>
                <DialogDescription>
                  Fill details to create a new route
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

                <Label>Zone ID</Label>
                <Input
                  type="number"
                  value={formData.zone_id}
                  onChange={(e) =>
                    setFormData({ ...formData, zone_id: e.target.value })
                  }
                />

                <Label>Assign Order Booker (optional)</Label>
                <Input
                  type="number"
                  value={formData.order_booker_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order_booker_id: e.target.value,
                    })
                  }
                />
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Route"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={routes}
        columns={columns}
        actions={(route) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleAssign(route)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>

            <DeleteConfirmDialog
              onConfirm={() => handleDelete(route.id)}
              title="Delete Route?"
              description="This will permanently delete this route."
              loading={isDeleting}
            />
          </div>
        )}
      />
    </div>
  );
}
