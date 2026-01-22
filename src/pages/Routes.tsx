import { useState } from "react";
import { Plus, Edit2, Route as RouteIcon, Users } from "lucide-react";
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

interface RouteData {
  id: string;
  name: string;
  code: string;
  zone: string;
  assignedStaff: string;
  shops: number;
  status: "active" | "inactive";
  createdAt: string;
}

const initialRoutes: RouteData[] = [
  {
    id: "R001",
    name: "North Route 1",
    code: "NR-001",
    zone: "Zone A - North",
    assignedStaff: "Ali Hassan",
    shops: 12,
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: "R002",
    name: "North Route 2",
    code: "NR-002",
    zone: "Zone A - North",
    assignedStaff: "Ahmed Khan",
    shops: 15,
    status: "active",
    createdAt: "2024-01-22",
  },
  {
    id: "R003",
    name: "South Route 1",
    code: "SR-001",
    zone: "Zone B - South",
    assignedStaff: "Imran Ali",
    shops: 10,
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: "R004",
    name: "Central Route 1",
    code: "CR-001",
    zone: "Zone C - Central",
    assignedStaff: "Usman Malik",
    shops: 18,
    status: "active",
    createdAt: "2024-02-05",
  },
  {
    id: "R005",
    name: "East Route 1",
    code: "ER-001",
    zone: "Zone D - East",
    assignedStaff: "Unassigned",
    shops: 8,
    status: "inactive",
    createdAt: "2024-02-10",
  },
];

const zones = [
  "Zone A - North",
  "Zone B - South",
  "Zone C - Central",
  "Zone D - East",
  "Zone E - West",
];
const staff = [
  "Ali Hassan",
  "Ahmed Khan",
  "Imran Ali",
  "Usman Malik",
  "Farhan Ahmed",
  "Bilal Shah",
];

export default function Routes() {
  const [routes, setRoutes] = useState<RouteData[]>(initialRoutes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    zone: "",
    assignedStaff: "",
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (editingRoute) {
      setRoutes(
        routes.map((r) =>
          r.id === editingRoute.id ? { ...r, ...formData } : r,
        ),
      );
      toast({
        title: "Route Updated",
        description: "Route has been updated successfully.",
      });
    } else {
      const newRoute: RouteData = {
        id: `R${String(routes.length + 1).padStart(3, "0")}`,
        name: formData.name,
        code: formData.code,
        zone: formData.zone,
        assignedStaff: formData.assignedStaff || "Unassigned",
        shops: 0,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setRoutes([...routes, newRoute]);
      toast({
        title: "Route Created",
        description: "New route has been created successfully.",
      });
    }
    setIsDialogOpen(false);
    setEditingRoute(null);
    setFormData({ name: "", code: "", zone: "", assignedStaff: "" });
  };

  const handleEdit = (route: RouteData) => {
    setEditingRoute(route);
    setFormData({
      name: route.name,
      code: route.code,
      zone: route.zone,
      assignedStaff: route.assignedStaff,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setRoutes(routes.filter((r) => r.id !== id));
    toast({
      title: "Route Deleted",
      description: "Route has been removed.",
      variant: "destructive",
    });
  };

  const columns = [
    { key: "code", label: "Code", sortable: true },
    { key: "name", label: "Route Name", sortable: true },
    {
      key: "zone",
      label: "Zone",
      render: (route: RouteData) => (
        <StatusBadge status="info" label={route.zone.split(" - ")[0]} />
      ),
    },
    {
      key: "assignedStaff",
      label: "Assigned Staff",
      render: (route: RouteData) => (
        <span
          className={
            route.assignedStaff === "Unassigned"
              ? "text-muted-foreground italic"
              : "font-medium"
          }
        >
          {route.assignedStaff}
        </span>
      ),
    },
    {
      key: "shops",
      label: "Shops",
      render: (route: RouteData) => (
        <span className="font-medium">{route.shops}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (route: RouteData) => (
        <StatusBadge
          status={route.status === "active" ? "success" : "neutral"}
          label={route.status === "active" ? "Active" : "Inactive"}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Routes</h1>
          <p className="text-muted-foreground text-sm">
            Manage delivery routes and staff assignments
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setEditingRoute(null);
                setFormData({
                  name: "",
                  code: "",
                  zone: "",
                  assignedStaff: "",
                });
              }}
            >
              <Plus className="w-4 h-4" />
              Add Route
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className=" ">
                {editingRoute ? "Edit Route" : "Create New Route"}
              </DialogTitle>
              <DialogDescription>
                {editingRoute
                  ? "Update route details below."
                  : "Fill in the details to create a new route."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Route Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., North Route 1"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Route Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g., NR-001"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Zone</Label>
                <Select
                  value={formData.zone}
                  onValueChange={(value) =>
                    setFormData({ ...formData, zone: value })
                  }
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {zones.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assign Order Booker</Label>
                <Select
                  value={formData.assignedStaff}
                  onValueChange={(value) =>
                    setFormData({ ...formData, assignedStaff: value })
                  }
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {staff.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-primary text-primary-foreground"
              >
                {editingRoute ? "Update Route" : "Create Route"}
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
              <RouteIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl   font-bold">{routes.length}</p>
              <p className="text-sm text-muted-foreground">Total Routes</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <RouteIcon className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl   font-bold">
                {routes.filter((r) => r.status === "active").length}
              </p>
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
              <p className="text-2xl   font-bold">
                {routes.filter((r) => r.assignedStaff === "Unassigned").length}
              </p>
              <p className="text-sm text-muted-foreground">Unassigned</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <RouteIcon className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl   font-bold">
                {routes.reduce((acc, r) => acc + r.shops, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Shops</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={routes}
        columns={columns}
        searchPlaceholder="Search routes..."
        actions={(route) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(route)}
              className="edit-btn-hover text-muted-foreground"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <DeleteConfirmDialog
              onConfirm={() => handleDelete(route.id)}
              title="Delete Route?"
              description="This will permanently delete this route."
            />
          </div>
        )}
      />
    </div>
  );
}
