import { useState } from "react";
import { Plus, Edit2, Warehouse, Package, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface WarehouseData {
  id: string;
  name: string;
  location: string;
  zones: string[];
  assignedDeliveryMen: string[];
  totalCapacity: number;
  usedCapacity: number;
  products: { name: string; quantity: number; minStock: number }[];
  status: "active" | "inactive";
}

const initialWarehouses: WarehouseData[] = [
  {
    id: "W001",
    name: "Main Warehouse - Korangi",
    location: "Korangi Industrial Area, Karachi",
    zones: ["Zone A", "Zone B"],
    assignedDeliveryMen: ["Usman Malik", "Farhan Ahmed"],
    totalCapacity: 10000,
    usedCapacity: 7500,
    products: [
      { name: "Premium Green Tea", quantity: 450, minStock: 100 },
      { name: "Classic Black Tea", quantity: 800, minStock: 200 },
      { name: "Tulip Special Blend", quantity: 350, minStock: 150 },
      { name: "Cardamom Tea", quantity: 250, minStock: 100 },
    ],
    status: "active",
  },
  {
    id: "W002",
    name: "North Warehouse",
    location: "North Nazimabad, Karachi",
    zones: ["Zone C"],
    assignedDeliveryMen: ["Bilal Shah"],
    totalCapacity: 5000,
    usedCapacity: 3200,
    products: [
      { name: "Premium Green Tea", quantity: 200, minStock: 100 },
      { name: "Classic Black Tea", quantity: 500, minStock: 200 },
      { name: "Jasmine Tea", quantity: 180, minStock: 80 },
    ],
    status: "active",
  },
  {
    id: "W003",
    name: "East Warehouse",
    location: "Malir Cantt, Karachi",
    zones: ["Zone D", "Zone E"],
    assignedDeliveryMen: [],
    totalCapacity: 3000,
    usedCapacity: 1500,
    products: [
      { name: "Premium Green Tea", quantity: 80, minStock: 100 },
      { name: "Classic Black Tea", quantity: 300, minStock: 200 },
    ],
    status: "active",
  },
];

const zones = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"];
const deliveryMen = ["Usman Malik", "Farhan Ahmed", "Bilal Shah", "Kamran Ali"];

export default function Warehouses() {
  const [warehouses, setWarehouses] =
    useState<WarehouseData[]>(initialWarehouses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] =
    useState<WarehouseData | null>(null);
  const { toast } = useToast();

  const handleEdit = (warehouse: WarehouseData) => {
    setSelectedWarehouse(warehouse);
    setIsDialogOpen(true);
  };

  const totalProducts = warehouses.reduce(
    (acc, w) => acc + w.products.reduce((a, p) => a + p.quantity, 0),
    0,
  );
  const lowStockProducts = warehouses.flatMap((w) =>
    w.products.filter((p) => p.quantity < p.minStock),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="  text-2xl font-bold text-foreground">
            Warehouses & Inventory
          </h1>
          <p className="text-muted-foreground">
            Manage warehouses, stock, and deliveries
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Add Warehouse
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className=" ">Create New Warehouse</DialogTitle>
              <DialogDescription>
                Add a new warehouse location
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Warehouse Name</Label>
                <Input
                  placeholder="e.g., South Warehouse"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="e.g., DHA Phase 2, Karachi"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Total Capacity (units)</Label>
                <Input
                  type="number"
                  placeholder="5000"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Assign Zones</Label>
                <Select>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select zones" />
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
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button
                className="bg-primary text-primary-foreground"
                onClick={() => toast({ title: "Warehouse Created" })}
              >
                Create Warehouse
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
              <Warehouse className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl   font-bold">{warehouses.length}</p>
              <p className="text-sm text-muted-foreground">Warehouses</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Package className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl   font-bold">
                {totalProducts.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Stock</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Package className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl   font-bold">{lowStockProducts.length}</p>
              <p className="text-sm text-muted-foreground">Low Stock Items</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <Users className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl   font-bold">
                {warehouses.reduce(
                  (acc, w) => acc + w.assignedDeliveryMen.length,
                  0,
                )}
              </p>
              <p className="text-sm text-muted-foreground">Delivery Staff</p>
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse Cards */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {warehouses.map((warehouse) => (
          <div key={warehouse.id} className="stat-card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Warehouse className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {warehouse.name}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {warehouse.location}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(warehouse)}
              >
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>

            {/* Capacity */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Capacity</span>
                <span className="font-medium">
                  {warehouse.usedCapacity.toLocaleString()} /{" "}
                  {warehouse.totalCapacity.toLocaleString()}
                </span>
              </div>
              <Progress
                value={(warehouse.usedCapacity / warehouse.totalCapacity) * 100}
                className="h-2"
              />
            </div>

            {/* Zones */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                Assigned Zones
              </p>
              <div className="flex flex-wrap gap-1">
                {warehouse.zones.map((zone) => (
                  <StatusBadge key={zone} status="info" label={zone} />
                ))}
              </div>
            </div>

            {/* Delivery Men */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                Delivery Staff
              </p>
              <div className="flex flex-wrap gap-1">
                {warehouse.assignedDeliveryMen.length > 0 ? (
                  warehouse.assignedDeliveryMen.map((name) => (
                    <StatusBadge key={name} status="success" label={name} />
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    None assigned
                  </span>
                )}
              </div>
            </div>

            {/* Products */}
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-2">Stock Levels</p>
              <div className="space-y-2">
                {warehouse.products.slice(0, 3).map((product) => (
                  <div
                    key={product.name}
                    className="flex justify-between items-center text-sm"
                  >
                    <span
                      className={
                        product.quantity < product.minStock
                          ? "text-destructive"
                          : ""
                      }
                    >
                      {product.name}
                    </span>
                    <span
                      className={`font-medium ${product.quantity < product.minStock ? "text-destructive" : ""}`}
                    >
                      {product.quantity} units
                      {product.quantity < product.minStock && (
                        <span className="ml-1 text-xs text-destructive">
                          (Low)
                        </span>
                      )}
                    </span>
                  </div>
                ))}
                {warehouse.products.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-primary"
                  >
                    View all {warehouse.products.length} products
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="stat-card border-warning/50 bg-warning/5">
          <h3 className="font-semibold text-warning mb-3 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Low Stock Alerts
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.map((product, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-card flex justify-between items-center"
              >
                <span className="text-sm">{product.name}</span>
                <span className="text-sm font-medium text-destructive">
                  {product.quantity}/{product.minStock}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
