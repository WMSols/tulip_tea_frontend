import { useState } from "react";
import { Plus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/DataTable";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  useGetZonesQuery,
  useCreateZoneMutation,
  useDeleteZoneMutation,
  useUpdateZoneMutation,
} from "@/Redux/Api/zonesApi";
import { Zone } from "@/types/zones";

export default function Zones() {
  const { data: zones = [], isLoading: isLoadingZones } = useGetZonesQuery();
  const [createZone, { isLoading: isCreating }] = useCreateZoneMutation();
  const [deleteZone, { isLoading: isDeleting }] = useDeleteZoneMutation();
  const [updateZone, { isLoading: isUpdating }] = useUpdateZoneMutation();
  const [deleteDialogOpenId, setDeleteDialogOpenId] = useState<number | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredZones = zones.filter((z) =>
    z.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = async () => {
    try {
      if (editingZone) {
        await updateZone({
          id: editingZone.id,
          body: { name: formData.name },
        }).unwrap();
        toast({
          title: "Zone Updated",
          description: "Zone has been updated successfully.",
        });
      } else {
        await createZone({ name: formData.name }).unwrap();
        toast({
          title: "Zone Created",
          description: "New zone has been created successfully.",
        });
      }

      setIsDialogOpen(false);
      setFormData({ name: "" });
      setEditingZone(null);
    } catch (err) {
      toast({
        title: "Error",
        description: err?.data?.detail || "Failed to perform operation.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (zone: Zone) => {
    setEditingZone(zone);
    setFormData({ name: zone.name });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteZone(id).unwrap();
      toast({
        title: "Zone Deleted",
        description: "Zone has been removed.",
        variant: "destructive",
      });
      setDeleteDialogOpenId(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.data?.message || err?.error || "Failed to delete zone.",
        variant: "destructive",
      });
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Zone Name" },
    { key: "created_at", label: "Created" },
    {
      key: "actions",
      label: "Actions",
      render: (zone: Zone) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(zone)}
            disabled={isUpdating || isCreating || isDeleting}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <DeleteConfirmDialog
            open={deleteDialogOpenId === zone.id}
            onOpenChange={(open) =>
              setDeleteDialogOpenId(open ? zone.id : null)
            }
            onConfirm={() => handleDelete(zone.id)}
            title="Delete Zone?"
            description="This will permanently delete this zone and all data associated with it. This action cannot be undone."
            loading={isDeleting}
          />
        </div>
      ),
    },
  ];

  if (isLoadingZones) {
    return (
      <div className="flex items-center justify-center h-64">
        <Button disabled className="gap-2">
          <Plus className="w-4 h-4 animate-spin" /> Loading...
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Search */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Zones</h1>
          <p className="text-sm text-muted-foreground">
            Manage distribution zones
          </p>
        </div>
        <Input
          placeholder="Search zones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setEditingZone(null)}
              disabled={isCreating || isUpdating || isDeleting}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              {isCreating || isUpdating ? "Processing..." : "Add Zone"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingZone ? "Edit Zone" : "Create New Zone"}
              </DialogTitle>
              <DialogDescription>
                {editingZone
                  ? "Update zone details."
                  : "Fill in the details to create a new zone."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Label htmlFor="name">Zone Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                disabled={isCreating || isUpdating}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isCreating || isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating
                  ? "Processing..."
                  : editingZone
                    ? "Update"
                    : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <DataTable data={filteredZones} columns={columns} />
    </div>
  );
}
