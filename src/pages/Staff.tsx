import { useMemo, useState } from "react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/Redux/Hooks/hooks";
import { useGetZonesQuery } from "@/Redux/Api/zonesApi";
import {
  useGetOrderBookersByDistributorQuery,
  useCreateOrderBookerMutation,
  useUpdateOrderBookerMutation,
  useDeleteOrderBookerMutation,
} from "@/Redux/Api/orderBookerApi";

import {
  useGetDeliveryMenByDistributorQuery,
  useCreateDeliveryManMutation,
  useUpdateDeliveryManMutation,
  useDeleteDeliveryManMutation,
} from "@/Redux/Api/deliveryManApi";

interface StaffMemberUI {
  id: number;
  name: string;
  phone: string;
  role: "order_booker" | "delivery_man";
  zone_id: number;
  zoneLabel: string;
  routes: string[];
  status: "active" | "inactive";
  createdAt: string;
}

export default function Staff() {
  const distributorId = useAppSelector((state) => state.auth.user.id);

  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMemberUI | null>(null);
  const [activeTab, setActiveTab] = useState<
    "all" | "order_booker" | "delivery_man"
  >("all");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    role: "order_booker" as "order_booker" | "delivery_man",
    zone: "",
    routes: [] as string[],
  });

  /* ------------------- API ------------------- */

  const { data: zones = [], isLoading: isLoadingZones } = useGetZonesQuery();

  const { data: orderBookers = [] } = useGetOrderBookersByDistributorQuery({
    distributor_id: distributorId,
  });

  const { data: deliveryMen = [] } = useGetDeliveryMenByDistributorQuery({
    distributor_id: distributorId,
  });

  /* ------------------- API HOOKS WITH LOADING STATES ------------------- */
  const [createOrderBooker, { isLoading: isCreatingOB }] =
    useCreateOrderBookerMutation();
  const [updateOrderBooker, { isLoading: isUpdatingOB }] =
    useUpdateOrderBookerMutation();
  const [deleteOrderBooker, { isLoading: isDeletingOB }] =
    useDeleteOrderBookerMutation();

  const [createDeliveryMan, { isLoading: isCreatingDM }] =
    useCreateDeliveryManMutation();
  const [updateDeliveryMan, { isLoading: isUpdatingDM }] =
    useUpdateDeliveryManMutation();
  const [deleteDeliveryMan, { isLoading: isDeletingDM }] =
    useDeleteDeliveryManMutation();

  /* ------------------- NORMALIZE ------------------- */
  const staffList: StaffMemberUI[] = useMemo(() => {
    const ob = orderBookers.map((o) => ({
      id: o.id,
      name: o.name,
      phone: o.phone,
      role: "order_booker" as const,
      zone_id: o.zone_id,
      zoneLabel:
        zones.find((z) => z.id === o.zone_id)?.name ?? `Zone ${o.zone_id}`,
      routes: [],
      status: (o.is_active ? "active" : "inactive") as "active" | "inactive",
      createdAt: o.created_at?.split("T")[0] || "",
    }));

    const dm = deliveryMen.map((d) => ({
      id: d.id,
      name: d.name,
      phone: d.phone,
      role: "delivery_man" as const,
      zone_id: d.zone_id,
      zoneLabel:
        zones.find((z) => z.id === d.zone_id)?.name ?? `Zone ${d.zone_id}`,
      routes: [],
      status: (d.is_active ? "active" : "inactive") as "active" | "inactive",
      createdAt: d.created_at?.split("T")[0] || "",
    }));

    return [...ob, ...dm];
  }, [orderBookers, deliveryMen, zones]);

  /* ------------------- HANDLERS ------------------- */
  const handleSubmit = async () => {
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        zone_id: Number(formData.zone),
      };

      if (editingStaff) {
        if (editingStaff.role === "order_booker") {
          await updateOrderBooker({
            order_booker_id: editingStaff.id,
            ...payload,
          }).unwrap();
        } else {
          await updateDeliveryMan({
            delivery_man_id: editingStaff.id,
            ...payload,
          }).unwrap();
        }

        toast({
          title: "Staff Updated",
          description: "Staff member updated successfully.",
        });
      } else {
        if (formData.role === "order_booker") {
          await createOrderBooker({
            distributor_id: distributorId,
            body: payload,
          }).unwrap();
        } else {
          await createDeliveryMan({
            distributor_id: distributorId,
            body: payload,
          }).unwrap();
        }

        toast({
          title: "Staff Added",
          description: "New staff member added successfully.",
        });
      }

      setIsDialogOpen(false);
      setEditingStaff(null);
      setFormData({
        name: "",
        phone: "",
        password: "",
        role: "order_booker",
        zone: "",
        routes: [],
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.data?.message || err?.error || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (staff: StaffMemberUI) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      phone: staff.phone,
      password: "",
      role: staff.role,
      zone: String(staff.zone_id),
      routes: staff.routes,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (staff: StaffMemberUI) => {
    try {
      if (staff.role === "order_booker") {
        await deleteOrderBooker({
          order_booker_id: staff.id,
        }).unwrap();
      } else {
        await deleteDeliveryMan({
          delivery_man_id: staff.id,
        }).unwrap();
      }

      toast({
        title: "Staff Removed",
        description: "Staff member removed successfully.",
        variant: "destructive",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove staff.",
        variant: "destructive",
      });
    }
  };

  const filteredStaff =
    activeTab === "all"
      ? staffList
      : staffList.filter((s) => s.role === activeTab);

  const orderBookersCount = staffList.filter(
    (s) => s.role === "order_booker",
  ).length;

  const deliveryMenCount = staffList.filter(
    (s) => s.role === "delivery_man",
  ).length;

  /* ------------------- TABLE ------------------- */
  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "phone", label: "Phone" },
    {
      key: "role",
      label: "Role",
      render: (staff: StaffMemberUI) => (
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
      render: (staff: StaffMemberUI) => (
        <span className="font-medium">{staff.zoneLabel}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (staff: StaffMemberUI) => (
        <StatusBadge
          status={staff.status === "active" ? "success" : "neutral"}
          label={staff.status === "active" ? "Active" : "Inactive"}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage order bookers and delivery personnel
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2"
              onClick={() => {
                setEditingStaff(null);
                setFormData({
                  name: "",
                  phone: "",
                  password: "",
                  role: "order_booker",
                  zone: "",
                  routes: [],
                });
              }}
              disabled={
                isCreatingOB || isCreatingDM || isUpdatingOB || isUpdatingDM
              }
            >
              <Plus className="w-4 h-4" />
              {isCreatingOB || isCreatingDM || isUpdatingOB || isUpdatingDM
                ? "Processing..."
                : "Add Staff"}
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
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
                <div className="col-span-2 space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>

              {!editingStaff && (
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(v) =>
                      setFormData({ ...formData, role: v as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order_booker">Order Booker</SelectItem>
                      <SelectItem value="delivery_man">Delivery Man</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Zone</Label>

                <Select
                  value={formData.zone}
                  onValueChange={(v) => setFormData({ ...formData, zone: v })}
                  disabled={isLoadingZones}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>

                  <SelectContent>
                    {zones.map((z) => (
                      <SelectItem key={z.id} value={String(z.id)}>
                        {z.name}
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
                disabled={
                  isCreatingOB || isCreatingDM || isUpdatingOB || isUpdatingDM
                }
              >
                {isCreatingOB || isCreatingDM || isUpdatingOB || isUpdatingDM
                  ? "Processing..."
                  : editingStaff
                    ? "Update Staff"
                    : "Add Staff"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <Users />
          <div>
            <p className="text-2xl font-bold">{staffList.length}</p>
            <p className="text-sm text-muted-foreground">Total Staff</p>
          </div>
        </div>
        <div className="stat-card">
          <UserCheck />
          <div>
            <p className="text-2xl font-bold">{orderBookersCount}</p>
            <p className="text-sm text-muted-foreground">Order Bookers</p>
          </div>
        </div>
        <div className="stat-card">
          <Truck />
          <div>
            <p className="text-2xl font-bold">{deliveryMenCount}</p>
            <p className="text-sm text-muted-foreground">Delivery Men</p>
          </div>
        </div>
        <div className="stat-card">
          <Users />
          <div>
            <p className="text-2xl font-bold">
              {staffList.filter((s) => s.status === "active").length}
            </p>
            <p className="text-sm text-muted-foreground">Active Today</p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All Staff</TabsTrigger>
          <TabsTrigger value="order_booker">Order Bookers</TabsTrigger>
          <TabsTrigger value="delivery_man">Delivery Men</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* TABLE */}
      <DataTable
        data={filteredStaff}
        columns={columns}
        getRowKey={(row) => `${row.role}-${row.id}`}
        actions={(staff: StaffMemberUI) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(staff)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <DeleteConfirmDialog
              onConfirm={() => handleDelete(staff)}
              loading={
                staff.role === "order_booker" ? isDeletingOB : isDeletingDM
              }
              title="Remove Staff?"
              description="This will remove this staff member."
            />
          </div>
        )}
      />
    </div>
  );
}
