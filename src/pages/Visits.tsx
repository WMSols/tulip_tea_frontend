import { useEffect, useMemo, useState } from "react";
import {
  ClipboardCheck,
  MapPin,
  Camera,
  Package,
  Eye,
  ExternalLink,
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
import type { DeliveryDto, OrderDto, ShopVisitDto } from "@/types/visits";
import {
  useGetDeliveriesByDistributorQuery,
  useGetShopVisitsAllQuery,
  useLazyGetOrderByIdQuery,
} from "@/Redux/Api/visitsApi";

type ActiveTab = "all" | "order_booking" | "deliveries";

type VisitRow =
  | {
      rowKey: string;
      kind: "shop_visit";
      id: number;
      shop_id: number;
      shop_name: string;
      shop_zone_id: number;
      staff_name: string;
      staff_role: "order_booker" | "delivery_man" | "unknown";
      visit_types: string[];
      gps_lat: number | null;
      gps_lng: number | null;
      visit_time: string; // ISO
      photos: string[];
      reason: string | null;
      order_id: number | null;
      collection_id: number | null;
    }
  | {
      rowKey: string;
      kind: "delivery";
      id: number;
      order_id: number;
      shop_id: number;
      shop_name: string;
      shop_zone_id: number;
      delivery_man_name: string;
      status: string;
      picked_up_at: string | null;
      delivered_at: string | null;
      returned_at: string | null;
      pickup_gps_lat: number | null;
      pickup_gps_lng: number | null;
      delivery_gps_lat: number | null;
      delivery_gps_lng: number | null;
      return_gps_lat: number | null;
      return_gps_lng: number | null;
      delivery_remarks: string | null;
      return_reason: string | null;
      delivery_images: string[];
      delivery_items_count: number;
      created_at: string; // ISO
    };

type ShopVisitRow = Extract<VisitRow, { kind: "shop_visit" }>;

function formatDateTime(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTimeOnly(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function zoneLabel(zoneId: number | null | undefined) {
  if (!zoneId) return "Zone -";
  return `Zone ${zoneId}`;
}

function mapsLink(lat: number | null, lng: number | null) {
  if (lat == null || lng == null) return null;
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export default function Visits() {
  const { toast } = useToast();

  // TODO: replace with auth-selected distributor id
  const distributorId = 1;

  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [filterZone, setFilterZone] = useState<string>("all");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selected, setSelected] = useState<VisitRow | null>(null);

  const {
    data: shopVisits = [],
    isLoading: isLoadingShopVisits,
    isError: isShopVisitsError,
  } = useGetShopVisitsAllQuery({ limit: 1000 });

  const {
    data: deliveries = [],
    isLoading: isLoadingDeliveries,
    isError: isDeliveriesError,
  } = useGetDeliveriesByDistributorQuery({ distributorId, limit: 1000 });

  const [
    fetchOrder,
    { data: orderData, isFetching: isOrderFetching, isError: isOrderError },
  ] = useLazyGetOrderByIdQuery();

  const rows: VisitRow[] = useMemo(() => {
    const svRows: VisitRow[] = (shopVisits ?? []).map((v: ShopVisitDto) => {
      const staffName = v.order_booker_name ?? v.delivery_man_name ?? "Unknown";

      // Fix: VisitRow is a union; staff_role only exists on the shop_visit variant
      const staffRole: ShopVisitRow["staff_role"] =
        v.order_booker_id != null
          ? "order_booker"
          : v.delivery_man_id != null
            ? "delivery_man"
            : "unknown";

      const photos =
        Array.isArray(v.photos) && v.photos.length > 0
          ? v.photos
          : v.photo
            ? [v.photo]
            : [];

      return {
        rowKey: `SV-${v.id}`,
        kind: "shop_visit",
        id: v.id,
        shop_id: v.shop_id,
        shop_name: v.shop_name,
        shop_zone_id: v.shop_zone_id,
        staff_name: staffName,
        staff_role: staffRole,
        visit_types: v.visit_types ?? [],
        gps_lat: v.gps_lat,
        gps_lng: v.gps_lng,
        visit_time: v.visit_time,
        photos,
        reason: v.reason,
        order_id: v.order_id,
        collection_id: v.collection_id,
      };
    });

    const dRows: VisitRow[] = (deliveries ?? []).map((d: DeliveryDto) => ({
      rowKey: `DL-${d.id}`,
      kind: "delivery",
      id: d.id,
      order_id: d.order_id,
      shop_id: d.shop_id,
      shop_name: d.shop_name,
      shop_zone_id: d.shop_zone_id,
      delivery_man_name: d.delivery_man_name,
      status: d.status,
      picked_up_at: d.picked_up_at,
      delivered_at: d.delivered_at,
      returned_at: d.returned_at,
      pickup_gps_lat: d.pickup_gps_lat,
      pickup_gps_lng: d.pickup_gps_lng,
      delivery_gps_lat: d.delivery_gps_lat,
      delivery_gps_lng: d.delivery_gps_lng,
      return_gps_lat: d.return_gps_lat,
      return_gps_lng: d.return_gps_lng,
      delivery_remarks: d.delivery_remarks,
      return_reason: d.return_reason,
      delivery_images: d.delivery_images ?? [],
      delivery_items_count: d.delivery_items?.length ?? 0,
      created_at: d.created_at,
    }));

    // newest first
    const all = [...svRows, ...dRows];
    all.sort((a, b) => {
      const aTime =
        a.kind === "shop_visit"
          ? new Date(a.visit_time).getTime()
          : new Date(
              a.delivered_at ?? a.returned_at ?? a.picked_up_at ?? a.created_at,
            ).getTime();
      const bTime =
        b.kind === "shop_visit"
          ? new Date(b.visit_time).getTime()
          : new Date(
              b.delivered_at ?? b.returned_at ?? b.picked_up_at ?? b.created_at,
            ).getTime();
      return bTime - aTime;
    });

    return all;
  }, [shopVisits, deliveries]);

  const zoneOptions = useMemo(() => {
    const ids = new Set<number>();
    for (const r of rows) ids.add(r.shop_zone_id);
    return Array.from(ids).sort((a, b) => a - b);
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows
      .filter((r) => {
        if (activeTab === "all") return true;
        if (activeTab === "deliveries") return r.kind === "delivery";
        return (
          r.kind === "shop_visit" && r.visit_types.includes("order_booking")
        );
      })
      .filter(
        (r) => filterZone === "all" || String(r.shop_zone_id) === filterZone,
      );
  }, [rows, activeTab, filterZone]);

  const totalCount = rows.length;
  const orderBookingCount = rows.filter(
    (r) => r.kind === "shop_visit" && r.visit_types.includes("order_booking"),
  ).length;
  const deliveriesCount = rows.filter((r) => r.kind === "delivery").length;

  const isLoading = isLoadingShopVisits || isLoadingDeliveries;
  const isError = isShopVisitsError || isDeliveriesError;

  const handleViewDetails = (row: VisitRow) => {
    setSelected(row);
    setIsDialogOpen(true);
  };

  // fetch order details when dialog opens and selected has order_id
  useEffect(() => {
    if (!isDialogOpen || !selected) return;
    const orderId =
      selected.kind === "delivery" ? selected.order_id : selected.order_id;
    if (!orderId) return;
    fetchOrder({ orderId });
  }, [isDialogOpen, selected, fetchOrder]);

  useEffect(() => {
    if (isError) {
      toast({
        title: "Failed to load",
        description: "Could not fetch visits/deliveries. Please try again.",
        variant: "destructive" as any,
      });
    }
  }, [isError, toast]);

  const columns = [
    {
      key: "time",
      label: "Time",
      sortable: true,
      render: (row: VisitRow) => {
        const iso =
          row.kind === "shop_visit"
            ? row.visit_time
            : (row.delivered_at ??
              row.returned_at ??
              row.picked_up_at ??
              row.created_at);
        return <span className="font-medium">{formatTimeOnly(iso)}</span>;
      },
    },
    {
      key: "staff",
      label: "Staff",
      sortable: true,
      render: (row: VisitRow) => {
        const name =
          row.kind === "shop_visit" ? row.staff_name : row.delivery_man_name;
        return <span>{name}</span>;
      },
    },
    {
      key: "type",
      label: "Type",
      render: (row: VisitRow) => {
        if (row.kind === "delivery")
          return <StatusBadge status="success" label="Delivery" />;
        const isOrderBooking = row.visit_types.includes("order_booking");
        return (
          <StatusBadge
            status={isOrderBooking ? "info" : "neutral"}
            label={isOrderBooking ? "Order Booking" : "Shop Visit"}
          />
        );
      },
    },
    {
      key: "shop",
      label: "Shop",
      render: (row: VisitRow) => (
        <span className="font-medium text-foreground">{row.shop_name}</span>
      ),
    },
    {
      key: "zone",
      label: "Zone",
      className: "hidden lg:table-cell",
      render: (row: VisitRow) => (
        <StatusBadge status="neutral" label={zoneLabel(row.shop_zone_id)} />
      ),
    },
    {
      key: "order_id",
      label: "Order",
      render: (row: VisitRow) => {
        const orderId = row.kind === "delivery" ? row.order_id : row.order_id;
        return orderId ? (
          <span className="font-medium">#{orderId}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row: VisitRow) => {
        if (row.kind === "delivery") {
          const s = String(row.status ?? "").toLowerCase();
          const badgeStatus =
            s === "delivered"
              ? "success"
              : s === "returned"
                ? "warning"
                : s === "picked_up"
                  ? "info"
                  : "neutral";
          return <StatusBadge status={badgeStatus as any} label={row.status} />;
        }

        return row.order_id ? (
          <StatusBadge status="success" label="Order Created" />
        ) : (
          <StatusBadge status="neutral" label="Visited" />
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="  text-2xl font-bold text-foreground">Field Visits</h1>
          <p className="text-muted-foreground">
            Shop visits and deliveries (live)
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ClipboardCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl   font-bold">{totalCount}</p>
              <p className="text-sm text-muted-foreground">Total Records</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <Package className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl   font-bold">{orderBookingCount}</p>
              <p className="text-sm text-muted-foreground">
                Order Booking Visits
              </p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <ClipboardCheck className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl   font-bold">{deliveriesCount}</p>
              <p className="text-sm text-muted-foreground">Deliveries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as ActiveTab)}
        >
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-card">
              All
            </TabsTrigger>
            <TabsTrigger
              value="order_booking"
              className="data-[state=active]:bg-card"
            >
              Order Booking
            </TabsTrigger>
            <TabsTrigger
              value="deliveries"
              className="data-[state=active]:bg-card"
            >
              Deliveries
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={filterZone} onValueChange={setFilterZone}>
          <SelectTrigger className="w-40 bg-card border-border">
            <SelectValue placeholder="Filter by Zone" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Zones</SelectItem>
            {zoneOptions.map((z) => (
              <SelectItem key={z} value={String(z)}>
                {zoneLabel(z)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Data Table (mobileCard removed as requested) */}
      <DataTable
        data={isLoading ? [] : filteredRows}
        columns={columns}
        actions={(row: VisitRow) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleViewDetails(row)}
              className="text-muted-foreground hover:text-primary"
              aria-label="View details"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        )}
      />

      {/* Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className=" ">Details</DialogTitle>
            <DialogDescription>
              {selected?.kind === "delivery"
                ? "Delivery details"
                : "Shop visit details"}
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable body */}
          <div className="overflow-y-auto pr-2 max-h-[65vh]">
            {selected && (
              <div className="space-y-4 py-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ClipboardCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selected.shop_name}
                    </h3>
                    <p className="text-muted-foreground">
                      {selected.kind === "shop_visit"
                        ? formatDateTime(selected.visit_time)
                        : formatDateTime(
                            selected.delivered_at ??
                              selected.returned_at ??
                              selected.picked_up_at ??
                              selected.created_at,
                          )}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Zone</p>
                    <StatusBadge
                      status="neutral"
                      label={zoneLabel(selected.shop_zone_id)}
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Type</p>
                    {selected.kind === "delivery" ? (
                      <StatusBadge status="success" label="Delivery" />
                    ) : (
                      <StatusBadge
                        status={
                          selected.visit_types.includes("order_booking")
                            ? "info"
                            : "neutral"
                        }
                        label={
                          selected.visit_types.includes("order_booking")
                            ? "Order Booking"
                            : "Shop Visit"
                        }
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Staff</p>
                    <p className="font-medium">
                      {selected.kind === "shop_visit"
                        ? selected.staff_name
                        : selected.delivery_man_name}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Order</p>
                    <p className="font-medium">
                      {selected.kind === "delivery"
                        ? `#${selected.order_id}`
                        : selected.order_id
                          ? `#${selected.order_id}`
                          : "-"}
                    </p>
                  </div>
                </div>
                {/* Location links */}
                <div className="grid grid-cols-1 gap-2">
                  {selected.kind === "shop_visit" ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> GPS
                      </span>
                      {mapsLink(selected.gps_lat, selected.gps_lng) ? (
                        <a
                          href={mapsLink(selected.gps_lat, selected.gps_lng)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline flex items-center gap-1"
                        >
                          View on Map <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          N/A
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Delivery GPS
                        </span>
                        {mapsLink(
                          selected.delivery_gps_lat,
                          selected.delivery_gps_lng,
                        ) ? (
                          <a
                            href={
                              mapsLink(
                                selected.delivery_gps_lat,
                                selected.delivery_gps_lng,
                              )!
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary hover:underline flex items-center gap-1"
                          >
                            View on Map <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            N/A
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Pickup GPS
                        </span>
                        {mapsLink(
                          selected.pickup_gps_lat,
                          selected.pickup_gps_lng,
                        ) ? (
                          <a
                            href={
                              mapsLink(
                                selected.pickup_gps_lat,
                                selected.pickup_gps_lng,
                              )!
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary hover:underline flex items-center gap-1"
                          >
                            View on Map <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            N/A
                          </span>
                        )}
                      </div>

                      {selected.returned_at && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Return GPS
                          </span>
                          {mapsLink(
                            selected.return_gps_lat,
                            selected.return_gps_lng,
                          ) ? (
                            <a
                              href={
                                mapsLink(
                                  selected.return_gps_lat,
                                  selected.return_gps_lng,
                                )!
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-primary hover:underline flex items-center gap-1"
                            >
                              View on Map <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              N/A
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Shop Visit specific */}
                {selected.kind === "shop_visit" &&
                  (() => {
                    const isOrderBooking =
                      selected.visit_types.includes("order_booking");
                    const badgeStatus = isOrderBooking ? "info" : "neutral";
                    const badgeLabel = isOrderBooking
                      ? "Order Booking"
                      : "Shop Visit";

                    const roleLabel =
                      selected.staff_role === "order_booker"
                        ? "Order Booker"
                        : selected.staff_role === "delivery_man"
                          ? "Delivery Man"
                          : "Unknown";

                    return (
                      <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
                        {/* Header */}
                        <div className="p-4 border-b border-border flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm text-muted-foreground">
                              Visit Info
                            </p>
                            <p className="font-semibold text-foreground leading-6">
                              Visit #{selected.id}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Shop{" "}
                              <span className="font-medium text-foreground">
                                {selected.shop_name}
                              </span>
                            </p>
                          </div>

                          <div className="shrink-0 flex flex-col items-end gap-2">
                            <StatusBadge
                              status={badgeStatus as any}
                              label={badgeLabel}
                            />
                            <div className="text-xs text-muted-foreground">
                              Photos{" "}
                              <span className="font-medium tabular-nums text-foreground">
                                {selected.photos.length}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Table */}
                        <div className="p-4">
                          <div className="rounded-lg border border-border overflow-hidden bg-card">
                            <table className="w-full text-sm">
                              <tbody>
                                <tr className="border-b border-border">
                                  <td className="px-3 py-2 text-muted-foreground w-36">
                                    Visit Time
                                  </td>
                                  <td className="px-3 py-2 text-right font-medium tabular-nums">
                                    {formatDateTime(selected.visit_time)}
                                  </td>
                                </tr>

                                <tr className="border-b border-border">
                                  <td className="px-3 py-2 text-muted-foreground">
                                    Staff
                                  </td>
                                  <td className="px-3 py-2 text-right font-medium">
                                    {selected.staff_name}{" "}
                                    <span className="text-muted-foreground font-normal">
                                      • {roleLabel}
                                    </span>
                                  </td>
                                </tr>

                                <tr className="border-b border-border">
                                  <td className="px-3 py-2 text-muted-foreground">
                                    Visit Types
                                  </td>
                                  <td className="px-3 py-2 text-right font-medium break-words">
                                    {selected.visit_types.length
                                      ? selected.visit_types.join(", ")
                                      : "-"}
                                  </td>
                                </tr>

                                <tr className="border-b border-border">
                                  <td className="px-3 py-2 text-muted-foreground">
                                    Order
                                  </td>
                                  <td className="px-3 py-2 text-right font-medium tabular-nums">
                                    {selected.order_id
                                      ? `#${selected.order_id}`
                                      : "-"}
                                  </td>
                                </tr>

                                <tr className="border-b border-border">
                                  <td className="px-3 py-2 text-muted-foreground">
                                    Collection ID
                                  </td>
                                  <td className="px-3 py-2 text-right font-medium tabular-nums">
                                    {selected.collection_id ?? "-"}
                                  </td>
                                </tr>

                                <tr>
                                  <td className="px-3 py-2 text-muted-foreground">
                                    Reason
                                  </td>
                                  <td className="px-3 py-2 text-right font-medium break-words">
                                    {selected.reason ?? "-"}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                {/* Delivery specific */}
                {selected.kind === "delivery" &&
                  (() => {
                    const s = String(selected.status ?? "").toLowerCase();
                    const badgeStatus =
                      s === "delivered"
                        ? "success"
                        : s === "returned"
                          ? "warning"
                          : s === "picked_up"
                            ? "info"
                            : "neutral";

                    return (
                      <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
                        {/* Header */}
                        <div className="p-4 border-b border-border flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm text-muted-foreground">
                              Delivery Info
                            </p>
                            <p className="font-semibold text-foreground leading-6">
                              Delivery #{selected.id}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Order{" "}
                              <span className="font-medium tabular-nums text-foreground">
                                #{selected.order_id}
                              </span>
                            </p>
                          </div>

                          <div className="shrink-0 flex flex-col items-end gap-2">
                            <StatusBadge
                              status={badgeStatus as any}
                              label={selected.status}
                            />
                            <div className="text-xs text-muted-foreground">
                              Items{" "}
                              <span className="font-medium tabular-nums text-foreground">
                                {selected.delivery_items_count}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Table */}
                        <div className="p-4">
                          <div className="rounded-lg border border-border overflow-hidden bg-card">
                            <table className="w-full text-sm">
                              <tbody>
                                <tr className="border-b border-border">
                                  <td className="px-3 py-2 text-muted-foreground w-36">
                                    Picked Up
                                  </td>
                                  <td className="px-3 py-2 text-right font-medium tabular-nums">
                                    {formatDateTime(selected.picked_up_at)}
                                  </td>
                                </tr>

                                <tr className="border-b border-border">
                                  <td className="px-3 py-2 text-muted-foreground">
                                    Delivered
                                  </td>
                                  <td className="px-3 py-2 text-right font-medium tabular-nums">
                                    {formatDateTime(selected.delivered_at)}
                                  </td>
                                </tr>

                                <tr className="border-b border-border">
                                  <td className="px-3 py-2 text-muted-foreground">
                                    Returned
                                  </td>
                                  <td className="px-3 py-2 text-right font-medium tabular-nums">
                                    {formatDateTime(selected.returned_at)}
                                  </td>
                                </tr>

                                <tr className="border-b border-border">
                                  <td className="px-3 py-2 text-muted-foreground">
                                    Return Reason
                                  </td>
                                  <td className="px-3 py-2 text-right font-medium break-words">
                                    {selected.return_reason ?? "-"}
                                  </td>
                                </tr>

                                <tr>
                                  <td className="px-3 py-2 text-muted-foreground">
                                    Remarks
                                  </td>
                                  <td className="px-3 py-2 text-right font-medium break-words">
                                    {selected.delivery_remarks ?? "-"}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                {/* Photos/Images */}
                {selected.kind === "shop_visit" &&
                  selected.photos.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Camera className="w-3 h-3" /> Photos (
                        {selected.photos.length})
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {selected.photos.map((_, i) => (
                          <div
                            key={i}
                            className="aspect-video bg-muted rounded-lg flex items-center justify-center"
                          >
                            <Camera className="w-6 h-6 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                {selected.kind === "delivery" &&
                  selected.delivery_images.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Camera className="w-3 h-3" /> Delivery Images (
                        {selected.delivery_images.length})
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {selected.delivery_images.map((_, i) => (
                          <div
                            key={i}
                            className="aspect-video bg-muted rounded-lg flex items-center justify-center"
                          >
                            <Camera className="w-6 h-6 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                {/* Order details (fetched on demand) */}
                {(() => {
                  const orderId =
                    selected.kind === "delivery"
                      ? selected.order_id
                      : selected.order_id;

                  if (!orderId) return null;

                  const order: OrderDto | undefined =
                    orderData && orderData.id === orderId
                      ? orderData
                      : undefined;

                  return (
                    <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Order Details
                      </p>

                      {isOrderFetching && (
                        <p className="text-sm text-muted-foreground">
                          Loading order...
                        </p>
                      )}
                      {isOrderError && (
                        <p className="text-sm text-destructive">
                          Failed to load order.
                        </p>
                      )}

                      {order && (
                        <>
                          <div className="flex justify-between">
                            <span>Order ID:</span>
                            <span className="font-medium">#{order.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className="font-medium">{order.status}</span>
                          </div>

                          {/* Items Table */}
                          <div className="space-y-2 pt-2">
                            <p className="text-sm text-muted-foreground">
                              Items
                            </p>

                            <div className="rounded-lg border border-border overflow-hidden bg-card">
                              <table className="w-full text-sm">
                                <thead className="bg-muted/40">
                                  <tr>
                                    <th className="px-3 py-2 text-left font-medium">
                                      Product
                                    </th>
                                    <th className="px-3 py-2 text-right font-medium">
                                      Qty
                                    </th>
                                    <th className="px-3 py-2 text-right font-medium">
                                      Unit Price
                                    </th>
                                    <th className="px-3 py-2 text-right font-medium">
                                      Total
                                    </th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {order.order_items.length === 0 ? (
                                    <tr className="border-t border-border">
                                      <td
                                        colSpan={4}
                                        className="px-3 py-3 text-center text-muted-foreground"
                                      >
                                        No items
                                      </td>
                                    </tr>
                                  ) : (
                                    order.order_items.map((it) => (
                                      <tr
                                        key={it.id}
                                        className="border-t border-border"
                                      >
                                        <td className="px-3 py-2">
                                          <div className="truncate">
                                            {it.product_name}
                                          </div>
                                        </td>
                                        <td className="px-3 py-2 text-right tabular-nums">
                                          {it.quantity}
                                        </td>
                                        <td className="px-3 py-2 text-right tabular-nums">
                                          {it.unit_price}
                                        </td>
                                        <td className="px-3 py-2 text-right tabular-nums font-medium">
                                          {it.total_price}
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>

                                <tfoot>
                                  <tr className="border-t border-border bg-muted/20">
                                    <td
                                      colSpan={3}
                                      className="px-3 py-2 text-right font-medium"
                                    >
                                      Grand Total
                                    </td>
                                    <td className="px-3 py-2 text-right tabular-nums font-semibold">
                                      {order.total_amount}
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
