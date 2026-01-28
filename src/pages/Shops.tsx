import { useMemo, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Store,
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  Phone,
  CreditCard,
  Image,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
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
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

import {
  useGetAllShopsQuery,
  useGetPendingShopsQuery,
  useVerifyShopMutation,
  useReassignShopMutation,
} from "@/Redux/Api/shopsApi";
import { useGetOrderBookersByDistributorQuery } from "@/Redux/Api/orderBookerApi";
import { useGetZonesQuery } from "@/Redux/Api/zonesApi";
import { useAppSelector } from "@/Redux/Hooks/hooks";
import { UiShop } from "@/types/shops";
import { ApiShop } from "@/types/shops";

export default function Shops() {
  const distributorId = useAppSelector((s) => s.auth.user.id);

  const { data: allShops = [], isLoading } = useGetAllShopsQuery();
  const { data: pendingShops = [] } = useGetPendingShopsQuery();

  const { data: orderBookers = [] } = useGetOrderBookersByDistributorQuery({
    distributor_id: distributorId,
  });
  console.log(allShops);

  const { data: zones = [], isLoading: isLoadingZones } = useGetZonesQuery();

  const [verifyShop, { isLoading: isVerifying }] = useVerifyShopMutation();
  const [reassignShop, { isLoading: isReassigning }] =
    useReassignShopMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [selectedOrderBookerId, setSelectedOrderBookerId] = useState<
    number | null
  >(null);

  const [selectedShop, setSelectedShop] = useState<UiShop | null>(null);

  const [newOrderBookerId, setNewOrderBookerId] = useState<string>("");

  const [activeTab, setActiveTab] = useState<"all" | "active" | "pending">(
    "all",
  );

  const [filterZone, setFilterZone] = useState<string>("all");

  const { toast } = useToast();
  console.log(zones);

  const zoneMap = useMemo(() => {
    const map: Record<number, string> = {};
    zones.forEach((z) => {
      map[z.id] = z.name;
    });
    return map;
  }, [zones]);

  // mapShop.ts
  const mapApiShopToUi = (
    shop: ApiShop,
    zoneMap: Record<number, string>,
  ): UiShop => ({
    id: shop.id,
    name: shop.name,
    ownerName: shop.owner_name,
    phone: shop.owner_phone,

    zone: zoneMap[shop.zone_id] || `Zone ${shop.zone_id}`,

    routes:
      shop.routes?.map((r) => ({
        id: r.route_id,
        name: r.route_name,
        sequence: r.sequence,
      })) ?? [],

    gps: `${shop.gps_lat},${shop.gps_lng}`,
    creditLimit: shop.credit_limit,
    balance: shop.outstanding_balance,

    status:
      shop.registration_status === "approved"
        ? "active"
        : shop.registration_status === "pending"
          ? "pending"
          : "rejected",

    createdAt: shop.created_at,
    assignedOrderBookerId: shop.assigned_to_order_booker,
    assignedOrderBookerName: shop.assigned_to_order_booker_name,
  });

  const shops = allShops.map((s) => mapApiShopToUi(s, zoneMap));

  const handleApprove = async (id: number) => {
    try {
      await verifyShop({
        shop_id: id,
        distributor_id: distributorId,
        body: { registration_status: "approved" },
      }).unwrap();

      toast({
        title: "Shop Approved",
        description: "Shop registration has been approved.",
      });

      setIsViewDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to approve shop.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      await verifyShop({
        shop_id: id,
        distributor_id: distributorId,
        body: {
          registration_status: "rejected",
          remarks: "Rejected by distributor",
        },
      }).unwrap();

      toast({
        title: "Shop Rejected",
        description: "Shop registration has been rejected.",
        variant: "destructive",
      });

      setIsViewDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to reject shop.",
        variant: "destructive",
      });
    }
  };

  const handleReassign = async () => {
    if (!selectedShop || !selectedOrderBookerId) return;

    try {
      await reassignShop({
        shop_id: selectedShop.id,
        new_order_booker_id: selectedOrderBookerId,
      }).unwrap();

      toast({
        title: "Shop Reassigned",
        description: "Shop assigned to new order booker.",
      });

      setIsReassignOpen(false);
      setSelectedOrderBookerId(null);
      setSelectedShop(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to reassign shop.",
        variant: "destructive",
      });
    }
  };

  const handleView = (shop: UiShop) => {
    setSelectedShop(shop);
    setIsViewDialogOpen(true);
  };

  const filteredShops = shops
    .filter((s) => activeTab === "all" || s.status === activeTab)
    .filter((s) => filterZone === "all" || s.zone === filterZone);

  const pendingCount = shops.filter((s) => s.status === "pending").length;

  const activeCount = shops.filter((s) => s.status === "active").length;

  const totalCredit = shops
    .filter((s) => s.status === "active")
    .reduce((acc, s) => acc + s.balance, 0);

  const columns = [
    { key: "name", label: "Shop Name", sortable: true },
    { key: "ownerName", label: "Owner" },
    { key: "phone", label: "Phone", className: "hidden md:table-cell" },
    {
      key: "zone",
      label: "Zone",
      render: (shop: UiShop) => <StatusBadge status="info" label={shop.zone} />,
    },
    {
      key: "routes",
      label: "Routes",
      className: "hidden lg:table-cell",
      render: (shop: UiShop) => {
        if (!shop.routes.length) return "-";

        return (
          <div className="flex flex-wrap gap-1">
            {shop.routes
              .sort((a, b) => a.sequence - b.sequence)
              .map((route) => (
                <span
                  key={route.id}
                  className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700"
                >
                  {route.name}
                </span>
              ))}
          </div>
        );
      },
    },
    {
      key: "balance",
      label: "Balance",
      render: (shop: UiShop) => (
        <span
          className={
            shop.balance > 0
              ? "text-destructive font-medium"
              : "text-success font-medium"
          }
        >
          ₨{shop.balance.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (shop: UiShop) => (
        <StatusBadge
          status={
            shop.status === "active"
              ? "success"
              : shop.status === "pending"
                ? "warning"
                : "danger"
          }
          label={shop.status.charAt(0).toUpperCase() + shop.status.slice(1)}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Shops Management</h1>
          <p className="text-muted-foreground">
            Manage registered shops and pending approvals
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-bold">{shops.length}</p>
          <p className="text-sm text-muted-foreground">Total Shops</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold">{activeCount}</p>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold">{pendingCount}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold">
            ₨{(totalCredit / 1000).toFixed(0)}K
          </p>
          <p className="text-sm text-muted-foreground">Outstanding</p>
        </div>
      </div>

      {/* Filters */}
      {/* … your same Tabs + Select block stays unchanged … */}

      {/* Data Table */}
      <DataTable
        data={filteredShops}
        columns={columns}
        actions={(shop: UiShop) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(shop)}
            >
              <Eye className="w-4 h-4" />
            </Button>

            {shop.status === "pending" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isVerifying}
                  onClick={() => handleApprove(shop.id)}
                >
                  {isVerifying ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-success border-t-transparent" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isVerifying}
                  onClick={() => handleReject(shop.id)}
                >
                  {isVerifying ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                </Button>
              </>
            )}

            {shop.status === "active" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedShop(shop);
                    setSelectedOrderBookerId(
                      shop.assignedOrderBookerId ?? null,
                    );
                    setIsReassignOpen(true);
                  }}
                >
                  <Users className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        )}
      />

      {/* Reassign Dialog */}
      <Dialog open={isReassignOpen} onOpenChange={setIsReassignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign Shop</DialogTitle>
            <DialogDescription>
              Assign this shop to another order booker
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Label>Order Booker</Label>
            <Select
              value={selectedOrderBookerId?.toString() || ""}
              onValueChange={(value) => setSelectedOrderBookerId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select order booker" />
              </SelectTrigger>

              <SelectContent>
                {orderBookers.map((ob: any) => (
                  <SelectItem key={ob.id} value={String(ob.id)}>
                    {ob.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReassignOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={isReassigning || !selectedOrderBookerId}
              onClick={handleReassign}
            >
              {isReassigning ? "Reassigning..." : "Reassign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      {/* 🔽 Your existing View Dialog JSX stays SAME */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className=" ">Shop Details</DialogTitle>
            <DialogDescription>
              View complete shop information
            </DialogDescription>
          </DialogHeader>
          {selectedShop && (
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Store className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedShop.name}</h3>
                  <p className="text-muted-foreground">
                    {selectedShop.ownerName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Phone
                  </p>
                  <p className="font-medium">{selectedShop.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location
                  </p>
                  <a
                    href={`https://www.google.com/maps?q=${selectedShop.gps}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    View on Map
                  </a>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Zone / Route</p>
                  <p className="font-medium">
                    {selectedShop.zone} /{" "}
                    {selectedShop.routes.map((r) => r.name).join(", ")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge
                    status={
                      selectedShop.status === "active"
                        ? "success"
                        : selectedShop.status === "pending"
                          ? "warning"
                          : "danger"
                    }
                    label={
                      selectedShop.status.charAt(0).toUpperCase() +
                      selectedShop.status.slice(1)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <CreditCard className="w-3 h-3" /> Credit Limit
                  </p>
                  <p className="font-medium">
                    ₨{selectedShop.creditLimit.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Outstanding Balance
                  </p>
                  <p
                    className={`font-medium ${selectedShop.balance > 0 ? "text-destructive" : "text-success"}`}
                  >
                    ₨{selectedShop.balance.toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedShop.status === "pending" && (
                <div className="space-y-2 pt-4 border-t">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Image className="w-3 h-3" /> CNIC Verification
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">
                        CNIC Front
                      </p>
                    </div>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">CNIC Back</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedShop?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleReject(selectedShop.id)}
                  className="text-destructive"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(selectedShop.id)}
                  className="bg-success text-success-foreground"
                >
                  Approve
                </Button>
              </>
            )}
            {selectedShop?.status !== "pending" && (
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className=" ">Edit Shop</DialogTitle>
            <DialogDescription>
              Update shop details and credit information
            </DialogDescription>
          </DialogHeader>
          {selectedShop && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Shop Name</Label>
                <Input
                  defaultValue={selectedShop.name}
                  className="bg-background border-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Credit Limit</Label>
                  <Input
                    type="number"
                    defaultValue={selectedShop.creditLimit}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Current Balance</Label>
                  <Input
                    type="number"
                    defaultValue={selectedShop.balance}
                    className="bg-background border-border"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground"
              onClick={() => {
                toast({
                  title: "Shop Updated",
                  description: "Shop details have been updated.",
                });
                setIsDialogOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
