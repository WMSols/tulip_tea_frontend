import { useState } from "react";
import { Plus, Edit2, MapPin } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Zone {
  id: string;
  name: string;
  code: string;
  description: string;
  routes: number;
  shops: number;
  createdAt: string;
  status: "active" | "inactive";
}

const initialZones: Zone[] = [
  { id: "Z001", name: "Zone A - North Karachi", code: "ZN-A", description: "Northern region of Karachi", routes: 8, shops: 45, createdAt: "2024-01-15", status: "active" },
  { id: "Z002", name: "Zone B - South Karachi", code: "ZN-B", description: "Southern coastal region", routes: 6, shops: 38, createdAt: "2024-01-18", status: "active" },
  { id: "Z003", name: "Zone C - Central", code: "ZN-C", description: "Central business district", routes: 10, shops: 62, createdAt: "2024-02-01", status: "active" },
  { id: "Z004", name: "Zone D - East", code: "ZN-D", description: "Eastern industrial area", routes: 5, shops: 28, createdAt: "2024-02-10", status: "active" },
  { id: "Z005", name: "Zone E - West", code: "ZN-E", description: "Western residential", routes: 7, shops: 41, createdAt: "2024-02-15", status: "inactive" },
];

export default function Zones() {
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "", description: "" });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (editingZone) {
      setZones(zones.map(z => 
        z.id === editingZone.id 
          ? { ...z, name: formData.name, code: formData.code, description: formData.description }
          : z
      ));
      toast({ title: "Zone Updated", description: "Zone has been updated successfully." });
    } else {
      const newZone: Zone = {
        id: `Z${String(zones.length + 1).padStart(3, "0")}`,
        name: formData.name,
        code: formData.code,
        description: formData.description,
        routes: 0,
        shops: 0,
        createdAt: new Date().toISOString().split("T")[0],
        status: "active",
      };
      setZones([...zones, newZone]);
      toast({ title: "Zone Created", description: "New zone has been created successfully." });
    }
    setIsDialogOpen(false);
    setEditingZone(null);
    setFormData({ name: "", code: "", description: "" });
  };

  const handleEdit = (zone: Zone) => {
    setEditingZone(zone);
    setFormData({ name: zone.name, code: zone.code, description: zone.description });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setZones(zones.filter(z => z.id !== id));
    toast({ title: "Zone Deleted", description: "Zone has been removed.", variant: "destructive" });
  };

  const columns = [
    { key: "code", label: "Code", sortable: true },
    { key: "name", label: "Zone Name", sortable: true },
    { 
      key: "routes", 
      label: "Routes",
      render: (zone: Zone) => <span className="font-medium">{zone.routes}</span>
    },
    { 
      key: "shops", 
      label: "Shops",
      render: (zone: Zone) => <span className="font-medium">{zone.shops}</span>
    },
    { key: "createdAt", label: "Created", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (zone: Zone) => (
        <StatusBadge 
          status={zone.status === "active" ? "success" : "neutral"} 
          label={zone.status === "active" ? "Active" : "Inactive"} 
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Zones</h1>
          <p className="text-muted-foreground text-sm">Manage distribution zones and their assignments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setEditingZone(null);
                setFormData({ name: "", code: "", description: "" });
              }}
            >
              <Plus className="w-4 h-4" />
              Add Zone
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border rounded-xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">{editingZone ? "Edit Zone" : "Create New Zone"}</DialogTitle>
              <DialogDescription>
                {editingZone ? "Update zone details below." : "Fill in the details to create a new zone."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Zone Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Zone A - North Karachi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Zone Code</Label>
                <Input
                  id="code"
                  placeholder="e.g., ZN-A"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the zone..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-lg">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-primary text-primary-foreground rounded-lg">
                {editingZone ? "Update Zone" : "Create Zone"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{zones.length}</p>
              <p className="text-sm text-muted-foreground">Total Zones</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-success/10">
              <MapPin className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{zones.filter(z => z.status === "active").length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-info/10">
              <MapPin className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">{zones.reduce((acc, z) => acc + z.routes, 0)}</p>
              <p className="text-sm text-muted-foreground">Total Routes</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent">
              <MapPin className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{zones.reduce((acc, z) => acc + z.shops, 0)}</p>
              <p className="text-sm text-muted-foreground">Total Shops</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={zones}
        columns={columns}
        searchPlaceholder="Search zones..."
        actions={(zone) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(zone)}
              className="edit-btn-hover text-muted-foreground"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <DeleteConfirmDialog
              onConfirm={() => handleDelete(zone.id)}
              title="Delete Zone?"
              description="This will permanently delete this zone and cannot be undone."
            />
          </div>
        )}
      />
    </div>
  );
}
