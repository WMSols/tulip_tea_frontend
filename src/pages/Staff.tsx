import { useState } from "react";
import { Plus, Edit2, Users, UserCheck, Truck } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface StaffMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: "order_booker" | "delivery_man";
  zone: string;
  routes: string[];
  status: "active" | "inactive";
  createdAt: string;
}

const initialStaff: StaffMember[] = [
  {
    id: "S001",
    name: "Ali Hassan",
    phone: "+92 300 1234567",
    email: "ali.h@tuliptea.pk",
    role: "order_booker",
    zone: "Zone A",
    routes: ["NR-001"],
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: "S002",
    name: "Ahmed Khan",
    phone: "+92 301 2345678",
    email: "ahmed.k@tuliptea.pk",
    role: "order_booker",
    zone: "Zone A",
    routes: ["NR-002"],
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: "S003",
    name: "Imran Ali",
    phone: "+92 302 3456789",
    email: "imran.a@tuliptea.pk",
    role: "order_booker",
    zone: "Zone B",
    routes: ["SR-001"],
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "S004",
    name: "Usman Malik",
    phone: "+92 303 4567890",
    email: "usman.m@tuliptea.pk",
    role: "delivery_man",
    zone: "Zone C",
    routes: ["CR-001", "CR-002"],
    status: "active",
    createdAt: "2024-01-18",
  },
  {
    id: "S005",
    name: "Farhan Ahmed",
    phone: "+92 304 5678901",
    email: "farhan.a@tuliptea.pk",
    role: "delivery_man",
    zone: "Zone A",
    routes: ["NR-001", "NR-002", "NR-003"],
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: "S006",
    name: "Bilal Shah",
    phone: "+92 305 6789012",
    email: "bilal.s@tuliptea.pk",
    role: "delivery_man",
    zone: "Zone B",
    routes: ["SR-001", "SR-002"],
    status: "inactive",
    createdAt: "2024-01-22",
  },
];

const zones = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"];
const availableRoutes = [
  "NR-001",
  "NR-002",
  "NR-003",
  "SR-001",
  "SR-002",
  "CR-001",
  "CR-002",
  "ER-001",
];

export default function Staff() {
  const [staffList, setStaffList] = useState<StaffMember[]>(initialStaff);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [activeTab, setActiveTab] = useState<
    "all" | "order_booker" | "delivery_man"
  >("all");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    role: "order_booker" as "order_booker" | "delivery_man",
    zone: "",
    routes: [] as string[],
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (editingStaff) {
      setStaffList(
        staffList.map((s) =>
          s.id === editingStaff.id ? { ...s, ...formData } : s,
        ),
      );
      toast({
        title: "Staff Updated",
        description: "Staff member has been updated successfully.",
      });
    } else {
      const newStaff: StaffMember = {
        id: `S${String(staffList.length + 1).padStart(3, "0")}`,
        ...formData,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setStaffList([...staffList, newStaff]);
      toast({
        title: "Staff Added",
        description: "New staff member has been added successfully.",
      });
    }
    setIsDialogOpen(false);
    setEditingStaff(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      role: "order_booker",
      zone: "",
      routes: [],
    });
  };

  const handleEdit = (staff: StaffMember) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      phone: staff.phone,
      email: staff.email,
      role: staff.role,
      zone: staff.zone,
      routes: staff.routes,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setStaffList(staffList.filter((s) => s.id !== id));
    toast({
      title: "Staff Removed",
      description: "Staff member has been removed.",
      variant: "destructive",
    });
  };

  const filteredStaff =
    activeTab === "all"
      ? staffList
      : staffList.filter((s) => s.role === activeTab);

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email", className: "hidden xl:table-cell" },
    {
      key: "role",
      label: "Role",
      render: (staff: StaffMember) => (
        <StatusBadge
          status={staff.role === "order_booker" ? "info" : "success"}
          label={
            staff.role === "order_booker" ? "Order Booker" : "Delivery Man"
          }
        />
      ),
    },
    {
      key: "zone",
      label: "Zone",
      render: (staff: StaffMember) => (
        <span className="font-medium">{staff.zone}</span>
      ),
    },
    {
      key: "routes",
      label: "Routes",
      render: (staff: StaffMember) => (
        <span className="text-sm">{staff.routes.join(", ")}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (staff: StaffMember) => (
        <StatusBadge
          status={staff.status === "active" ? "success" : "neutral"}
          label={staff.status === "active" ? "Active" : "Inactive"}
        />
      ),
    },
  ];

  const orderBookers = staffList.filter((s) => s.role === "order_booker");
  const deliveryMen = staffList.filter((s) => s.role === "delivery_man");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Staff Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage order bookers and delivery personnel
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setEditingStaff(null);
                setFormData({
                  name: "",
                  phone: "",
                  email: "",
                  role: "order_booker",
                  zone: "",
                  routes: [],
                });
              }}
            >
              <Plus className="w-4 h-4" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className=" ">
                {editingStaff ? "Edit Staff" : "Add New Staff"}
              </DialogTitle>
              <DialogDescription>
                {editingStaff
                  ? "Update staff details below."
                  : "Fill in the details to add a new staff member."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Ali Hassan"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+92 300 1234567"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@tuliptea.pk"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "order_booker" | "delivery_man") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="order_booker">Order Booker</SelectItem>
                    <SelectItem value="delivery_man">Delivery Man</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label>
                  Assign Routes (
                  {formData.role === "delivery_man"
                    ? "Multiple allowed"
                    : "Single"}
                  )
                </Label>
                <Select
                  value={formData.routes[0] || ""}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      routes:
                        formData.role === "delivery_man"
                          ? [...formData.routes, value].filter(
                              (v, i, a) => a.indexOf(v) === i,
                            )
                          : [value],
                    })
                  }
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select route(s)" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {availableRoutes.map((route) => (
                      <SelectItem key={route} value={route}>
                        {route}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.routes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.routes.map((route) => (
                      <span
                        key={route}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            routes: formData.routes.filter((r) => r !== route),
                          })
                        }
                      >
                        {route} ×
                      </span>
                    ))}
                  </div>
                )}
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
                {editingStaff ? "Update Staff" : "Add Staff"}
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
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl   font-bold">{staffList.length}</p>
              <p className="text-sm text-muted-foreground">Total Staff</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <UserCheck className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl   font-bold">{orderBookers.length}</p>
              <p className="text-sm text-muted-foreground">Order Bookers</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Truck className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl   font-bold">{deliveryMen.length}</p>
              <p className="text-sm text-muted-foreground">Delivery Men</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl   font-bold">
                {staffList.filter((s) => s.status === "active").length}
              </p>
              <p className="text-sm text-muted-foreground">Active Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
      >
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all" className="data-[state=active]:bg-card">
            All Staff
          </TabsTrigger>
          <TabsTrigger
            value="order_booker"
            className="data-[state=active]:bg-card"
          >
            Order Bookers
          </TabsTrigger>
          <TabsTrigger
            value="delivery_man"
            className="data-[state=active]:bg-card"
          >
            Delivery Men
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Data Table */}
      <DataTable
        data={filteredStaff}
        columns={columns}
        searchPlaceholder="Search staff..."
        actions={(staff) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(staff)}
              className="edit-btn-hover text-muted-foreground"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <DeleteConfirmDialog
              onConfirm={() => handleDelete(staff.id)}
              title="Remove Staff?"
              description="This will permanently remove this staff member."
            />
          </div>
        )}
      />
    </div>
  );
}
