import { useState } from "react";
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

interface Shop {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  zone: string;
  route: string;
  gps: string;
  cnicFront?: string;
  cnicBack?: string;
  creditLimit: number;
  balance: number;
  status: "active" | "pending" | "rejected" | "deleted";
  createdAt: string;
}

const initialShops: Shop[] = [
  {
    id: "SH001",
    name: "Karachi Tea Emporium",
    ownerName: "Muhammad Tariq",
    phone: "+92 300 1111111",
    zone: "Zone A",
    route: "NR-001",
    gps: "24.8607,67.0011",
    creditLimit: 50000,
    balance: 12500,
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: "SH002",
    name: "Ali's Tea House",
    ownerName: "Ali Raza",
    phone: "+92 301 2222222",
    zone: "Zone B",
    route: "SR-001",
    gps: "24.8750,67.0300",
    creditLimit: 30000,
    balance: 8000,
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: "SH003",
    name: "Green Leaf Store",
    ownerName: "Hamza Khan",
    phone: "+92 302 3333333",
    zone: "Zone A",
    route: "NR-002",
    gps: "24.8900,67.0100",
    creditLimit: 40000,
    balance: 0,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "SH004",
    name: "Gulshan Tea Corner",
    ownerName: "Farooq Ahmed",
    phone: "+92 303 4444444",
    zone: "Zone C",
    route: "CR-001",
    gps: "24.9100,67.0500",
    creditLimit: 0,
    balance: 0,
    status: "pending",
    createdAt: "2024-01-20",
  },
  {
    id: "SH005",
    name: "Premium Tea Hub",
    ownerName: "Kamran Shah",
    phone: "+92 304 5555555",
    zone: "Zone B",
    route: "SR-002",
    gps: "24.8650,67.0400",
    creditLimit: 0,
    balance: 0,
    status: "pending",
    createdAt: "2024-01-22",
  },
  {
    id: "SH006",
    name: "Sunrise Tea Shop",
    ownerName: "Waseem Abbas",
    phone: "+92 305 6666666",
    zone: "Zone D",
    route: "ER-001",
    gps: "24.9200,67.0700",
    creditLimit: 25000,
    balance: 15000,
    status: "active",
    createdAt: "2024-01-25",
  },
];

const zones = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"];
const routes = ["NR-001", "NR-002", "SR-001", "SR-002", "CR-001", "ER-001"];

export default function Shops() {
  const [shops, setShops] = useState<Shop[]>(initialShops);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "pending">(
    "all",
  );
  const [filterZone, setFilterZone] = useState<string>("all");
  const { toast } = useToast();

  const handleApprove = (id: string) => {
    setShops(
      shops.map((s) => (s.id === id ? { ...s, status: "active" as const } : s)),
    );
    toast({
      title: "Shop Approved",
      description: "Shop registration has been approved.",
    });
  };

  const handleReject = (id: string) => {
    setShops(
      shops.map((s) =>
        s.id === id ? { ...s, status: "rejected" as const } : s,
      ),
    );
    toast({
      title: "Shop Rejected",
      description: "Shop registration has been rejected.",
      variant: "destructive",
    });
  };

  const handleDelete = (id: string) => {
    setShops(
      shops.map((s) =>
        s.id === id ? { ...s, status: "deleted" as const } : s,
      ),
    );
    toast({
      title: "Shop Deleted",
      description: "Shop has been soft deleted.",
      variant: "destructive",
    });
  };

  const handleView = (shop: Shop) => {
    setSelectedShop(shop);
    setIsViewDialogOpen(true);
  };

  const filteredShops = shops
    .filter((s) => s.status !== "deleted")
    .filter((s) => activeTab === "all" || s.status === activeTab)
    .filter((s) => filterZone === "all" || s.zone === filterZone);

  const columns = [
    { key: "name", label: "Shop Name", sortable: true },
    { key: "ownerName", label: "Owner" },
    { key: "phone", label: "Phone", className: "hidden md:table-cell" },
    {
      key: "zone",
      label: "Zone",
      render: (shop: Shop) => <StatusBadge status="info" label={shop.zone} />,
    },
    { key: "route", label: "Route", className: "hidden lg:table-cell" },
    {
      key: "balance",
      label: "Balance",
      render: (shop: Shop) => (
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
      render: (shop: Shop) => (
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

  const pendingCount = shops.filter((s) => s.status === "pending").length;
  const activeCount = shops.filter((s) => s.status === "active").length;
  const totalCredit = shops
    .filter((s) => s.status === "active")
    .reduce((acc, s) => acc + s.balance, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="  text-2xl font-bold text-foreground">
            Shops Management
          </h1>
          <p className="text-muted-foreground">
            Manage registered shops and pending approvals
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Store className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl   font-bold">
                {shops.filter((s) => s.status !== "deleted").length}
              </p>
              <p className="text-sm text-muted-foreground">Total Shops</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl   font-bold">{activeCount}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Store className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl   font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <CreditCard className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl   font-bold">
                ₨{(totalCredit / 1000).toFixed(0)}K
              </p>
              <p className="text-sm text-muted-foreground">Outstanding</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        >
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-card">
              All
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-card">
              Active
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-card"
            >
              Pending{" "}
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-warning/20 text-warning rounded-full">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={filterZone} onValueChange={setFilterZone}>
          <SelectTrigger className="w-40 bg-card border-border">
            <SelectValue placeholder="Filter by Zone" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Zones</SelectItem>
            {zones.map((zone) => (
              <SelectItem key={zone} value={zone}>
                {zone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredShops}
        columns={columns}
        searchPlaceholder="Search shops..."
        actions={(shop) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(shop)}
              className="text-muted-foreground hover:text-primary"
            >
              <Eye className="w-4 h-4" />
            </Button>
            {shop.status === "pending" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleApprove(shop.id)}
                  className="text-muted-foreground hover:text-success"
                >
                  <CheckCircle className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleReject(shop.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <XCircle className="w-4 h-4" />
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
                    setIsDialogOpen(true);
                  }}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(shop.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        )}
      />

      {/* View Dialog */}
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
                    {selectedShop.zone} / {selectedShop.route}
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
