import { useState } from "react";
import { 
  ClipboardCheck, MapPin, Camera, Package, CreditCard, 
  CheckCircle, Clock, Eye, ExternalLink, Filter
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Visit {
  id: string;
  date: string;
  time: string;
  staffName: string;
  staffRole: "order_booker" | "delivery_man";
  shopName: string;
  zone: string;
  gps: string;
  photos: string[];
  type: "sales" | "delivery";
  orderId?: string;
  orderAmount?: number;
  collectionAmount?: number;
  collectionStatus?: "pending" | "approved";
  status: "completed" | "pending";
}

const initialVisits: Visit[] = [
  { id: "V001", date: "2024-01-28", time: "09:15 AM", staffName: "Ali Hassan", staffRole: "order_booker", shopName: "Karachi Tea Emporium", zone: "Zone A", gps: "24.8607,67.0011", photos: ["photo1.jpg"], type: "sales", orderId: "ORD-1234", orderAmount: 15000, status: "completed" },
  { id: "V002", date: "2024-01-28", time: "10:30 AM", staffName: "Usman Malik", staffRole: "delivery_man", shopName: "Ali's Tea House", zone: "Zone B", gps: "24.8750,67.0300", photos: ["photo2.jpg"], type: "delivery", orderId: "ORD-1200", orderAmount: 22000, collectionAmount: 22000, collectionStatus: "pending", status: "completed" },
  { id: "V003", date: "2024-01-28", time: "11:00 AM", staffName: "Ahmed Khan", staffRole: "order_booker", shopName: "Green Leaf Store", zone: "Zone A", gps: "24.8900,67.0100", photos: ["photo3.jpg", "photo4.jpg"], type: "sales", orderId: "ORD-1235", orderAmount: 18500, status: "completed" },
  { id: "V004", date: "2024-01-28", time: "11:45 AM", staffName: "Farhan Ahmed", staffRole: "delivery_man", shopName: "Premium Tea Corner", zone: "Zone C", gps: "24.9100,67.0500", photos: ["photo5.jpg"], type: "delivery", orderId: "ORD-1180", orderAmount: 30000, collectionAmount: 25000, collectionStatus: "approved", status: "completed" },
  { id: "V005", date: "2024-01-28", time: "02:00 PM", staffName: "Imran Ali", staffRole: "order_booker", shopName: "Sunrise Tea Shop", zone: "Zone D", gps: "24.9200,67.0700", photos: [], type: "sales", status: "pending" },
];

const zones = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"];

export default function Visits() {
  const [visits, setVisits] = useState<Visit[]>(initialVisits);
  const [activeTab, setActiveTab] = useState<"all" | "sales" | "delivery">("all");
  const [filterZone, setFilterZone] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const { toast } = useToast();

  const handleApproveCollection = (id: string) => {
    setVisits(visits.map(v => 
      v.id === id 
        ? { ...v, collectionStatus: "approved" as const }
        : v
    ));
    toast({ title: "Collection Approved", description: "Cash collection has been approved." });
    setIsDialogOpen(false);
  };

  const handleViewDetails = (visit: Visit) => {
    setSelectedVisit(visit);
    setIsDialogOpen(true);
  };

  const filteredVisits = visits
    .filter(v => activeTab === "all" || v.type === activeTab)
    .filter(v => filterZone === "all" || v.zone === filterZone);

  const salesCount = visits.filter(v => v.type === "sales").length;
  const deliveryCount = visits.filter(v => v.type === "delivery").length;
  const pendingCollections = visits.filter(v => v.collectionStatus === "pending").length;
  const totalCollection = visits.filter(v => v.collectionStatus === "approved").reduce((acc, v) => acc + (v.collectionAmount || 0), 0);

  const columns = [
    { key: "time", label: "Time", sortable: true },
    { key: "staffName", label: "Staff", sortable: true },
    { 
      key: "type", 
      label: "Type",
      render: (visit: Visit) => (
        <StatusBadge 
          status={visit.type === "sales" ? "info" : "success"} 
          label={visit.type === "sales" ? "Sales" : "Delivery"} 
        />
      )
    },
    { key: "shopName", label: "Shop" },
    { 
      key: "zone", 
      label: "Zone",
      render: (visit: Visit) => (
        <StatusBadge status="neutral" label={visit.zone} />
      ),
      className: "hidden lg:table-cell"
    },
    { 
      key: "orderAmount", 
      label: "Amount",
      render: (visit: Visit) => (
        visit.orderAmount ? (
          <span className="font-medium">₨{visit.orderAmount.toLocaleString()}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      )
    },
    {
      key: "status",
      label: "Status",
      render: (visit: Visit) => {
        if (visit.type === "delivery" && visit.collectionStatus) {
          return (
            <StatusBadge 
              status={visit.collectionStatus === "approved" ? "success" : "warning"} 
              label={visit.collectionStatus === "approved" ? "Collected" : "Pending"} 
            />
          );
        }
        return (
          <StatusBadge 
            status={visit.status === "completed" ? "success" : "warning"} 
            label={visit.status === "completed" ? "Done" : "In Progress"} 
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Field Visits</h1>
          <p className="text-muted-foreground">Track daily field visits and collections</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ClipboardCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold">{visits.length}</p>
              <p className="text-sm text-muted-foreground">Total Visits</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <Package className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold">{salesCount}</p>
              <p className="text-sm text-muted-foreground">Sales Visits</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <ClipboardCheck className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold">{deliveryCount}</p>
              <p className="text-sm text-muted-foreground">Deliveries</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <CreditCard className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold">₨{(totalCollection / 1000).toFixed(0)}K</p>
              <p className="text-sm text-muted-foreground">Collected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Collections Alert */}
      {pendingCollections > 0 && (
        <div className="stat-card border-warning/50 bg-warning/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-warning" />
              <div>
                <p className="font-medium text-warning">{pendingCollections} Pending Collections</p>
                <p className="text-sm text-muted-foreground">Cash collections awaiting approval</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-warning text-warning hover:bg-warning/10"
              onClick={() => setActiveTab("delivery")}
            >
              Review
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-card">All Visits</TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:bg-card">Sales</TabsTrigger>
            <TabsTrigger value="delivery" className="data-[state=active]:bg-card">
              Deliveries {pendingCollections > 0 && <span className="ml-1 px-1.5 py-0.5 text-xs bg-warning/20 text-warning rounded-full">{pendingCollections}</span>}
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
              <SelectItem key={zone} value={zone}>{zone}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredVisits}
        columns={columns}
        searchPlaceholder="Search visits..."
        actions={(visit) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleViewDetails(visit)}
              className="text-muted-foreground hover:text-primary"
            >
              <Eye className="w-4 h-4" />
            </Button>
            {visit.type === "delivery" && visit.collectionStatus === "pending" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleApproveCollection(visit.id)}
                className="text-muted-foreground hover:text-success"
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
        mobileCard={(visit) => (
          <div className="mobile-card">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-foreground">{visit.shopName}</p>
                <p className="text-sm text-muted-foreground">{visit.staffName} • {visit.time}</p>
              </div>
              <StatusBadge 
                status={visit.type === "sales" ? "info" : "success"} 
                label={visit.type === "sales" ? "Sales" : "Delivery"} 
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <StatusBadge status="neutral" label={visit.zone} />
              {visit.orderAmount && (
                <span className="font-medium">₨{visit.orderAmount.toLocaleString()}</span>
              )}
            </div>
            {visit.type === "delivery" && visit.collectionStatus && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Collection:</span>
                <StatusBadge 
                  status={visit.collectionStatus === "approved" ? "success" : "warning"} 
                  label={visit.collectionStatus === "approved" ? `₨${visit.collectionAmount?.toLocaleString()} Collected` : "Pending Approval"} 
                />
              </div>
            )}
            <div className="pt-3 border-t border-border flex justify-between items-center">
              <a 
                href={`https://www.google.com/maps?q=${visit.gps}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" /> View Location
              </a>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleViewDetails(visit)}>
                  <Eye className="w-4 h-4 mr-1" /> Details
                </Button>
                {visit.type === "delivery" && visit.collectionStatus === "pending" && (
                  <Button size="sm" className="bg-success text-success-foreground" onClick={() => handleApproveCollection(visit.id)}>
                    <CheckCircle className="w-4 h-4 mr-1" /> Approve
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      />

      {/* Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">Visit Details</DialogTitle>
            <DialogDescription>
              Complete information about this field visit
            </DialogDescription>
          </DialogHeader>
          {selectedVisit && (
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ClipboardCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedVisit.shopName}</h3>
                  <p className="text-muted-foreground">{selectedVisit.date} at {selectedVisit.time}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Staff</p>
                  <p className="font-medium">{selectedVisit.staffName}</p>
                  <StatusBadge 
                    status={selectedVisit.staffRole === "order_booker" ? "info" : "success"} 
                    label={selectedVisit.staffRole === "order_booker" ? "Order Booker" : "Delivery Man"} 
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <StatusBadge 
                    status={selectedVisit.type === "sales" ? "info" : "success"} 
                    label={selectedVisit.type === "sales" ? "Sales Visit" : "Delivery"} 
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location
                  </p>
                  <a 
                    href={`https://www.google.com/maps?q=${selectedVisit.gps}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    View on Map <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Zone</p>
                  <StatusBadge status="neutral" label={selectedVisit.zone} />
                </div>
              </div>

              {selectedVisit.orderId && (
                <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                  <p className="text-sm text-muted-foreground">Order Information</p>
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="font-medium">{selectedVisit.orderId}</span>
                  </div>
                  {selectedVisit.orderAmount && (
                    <div className="flex justify-between">
                      <span>Order Amount:</span>
                      <span className="font-medium text-primary">₨{selectedVisit.orderAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedVisit.type === "delivery" && (
                    <>
                      <div className="flex justify-between">
                        <span>Collection:</span>
                        <span className="font-medium">₨{selectedVisit.collectionAmount?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <StatusBadge 
                          status={selectedVisit.collectionStatus === "approved" ? "success" : "warning"} 
                          label={selectedVisit.collectionStatus === "approved" ? "Approved" : "Pending"} 
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {selectedVisit.photos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Camera className="w-3 h-3" /> Photos ({selectedVisit.photos.length})
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedVisit.photos.map((photo, i) => (
                      <div key={i} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <Camera className="w-6 h-6 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedVisit?.type === "delivery" && selectedVisit?.collectionStatus === "pending" && (
              <Button 
                onClick={() => handleApproveCollection(selectedVisit.id)} 
                className="bg-success text-success-foreground"
              >
                <CheckCircle className="w-4 h-4 mr-1" /> Approve Collection
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
