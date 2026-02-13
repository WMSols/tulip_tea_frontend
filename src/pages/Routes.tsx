import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit2,
  Eye,
  Loader2,
  CalendarDays,
  Route as RouteIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DeleteConfirmDialog } from "@/components/dashboard/DeleteConfirmDialog";
import { PageSkeleton } from "@/components/dashboard/PageSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { FormField } from "@/components/ui/FormField";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  useGetRoutesQuery,
  useCreateRouteMutation,
  useDeleteRouteMutation,
  useAssignRouteMutation,
  useUpdateRouteMutation,
} from "@/Redux/Api/routesApi";
import { useGetZonesQuery } from "@/Redux/Api/zonesApi";
import { useGetOrderBookersByDistributorQuery } from "@/Redux/Api/orderBookerApi";
import type { Route } from "@/types/routes";
import { useAppSelector } from "@/Redux/Hooks/hooks";
import type { CreateRouteRequest, UpdateRouteRequest } from "@/types/routes";
import { Zone } from "@/types/zones";
import { OrderBooker } from "@/types/staff";
import {
  routeSchema,
  validateForm,
  type FormErrors,
} from "@/lib/validations";
import { getDayName } from "@/types/weeklyRoutes";
import type {
  WeeklyRouteSchedule,
  CreateWeeklyRoutePayload,
  UpdateWeeklyRoutePayload,
} from "@/types/weeklyRoutes";

// --- Route form types ---
interface RouteFormData {
  name: string;
  zone_id: string;
  order_booker_id: string;
}

// --- Weekly routes mock data (replace with real API later) ---
const MOCK_SCHEDULES: WeeklyRouteSchedule[] = [
  { id: 1, assignee_type: "order_booker", assignee_id: 1, assignee_name: "Ali Hassan", route_id: 1, route_name: "North Route 1", day_of_week: 1, is_active: true, created_by_distributor: 1, created_at: "2026-01-20T10:00:00.000000+00:00" },
  { id: 2, assignee_type: "order_booker", assignee_id: 2, assignee_name: "Ahmed Khan", route_id: 2, route_name: "North Route 2", day_of_week: 2, is_active: true, created_by_distributor: 1, created_at: "2026-01-22T10:00:00.000000+00:00" },
  { id: 3, assignee_type: "delivery_man", assignee_id: 3, assignee_name: "Imran Ali", route_id: 3, route_name: "South Route 1", day_of_week: 3, is_active: true, created_by_distributor: 1, created_at: "2026-02-01T10:00:00.000000+00:00" },
  { id: 4, assignee_type: "order_booker", assignee_id: 4, assignee_name: "Usman Malik", route_id: 4, route_name: "Central Route 1", day_of_week: 4, is_active: false, created_by_distributor: 1, created_at: "2026-02-05T10:00:00.000000+00:00" },
  { id: 5, assignee_type: "delivery_man", assignee_id: 5, assignee_name: "Farhan Ahmed", route_id: 5, route_name: "East Route 1", day_of_week: 5, is_active: true, created_by_distributor: 1, created_at: "2026-02-10T10:00:00.000000+00:00" },
];

const WEEKLY_DAYS = [0, 1, 2, 3, 4, 5, 6];

function assigneeTypeBadge(type: string) {
  if (type === "order_booker")
    return <StatusBadge status="info" label="Order Booker" />;
  if (type === "delivery_man")
    return <StatusBadge status="warning" label="Delivery Man" />;
  return <StatusBadge status="neutral" label={type} />;
}

// --- Component ---
export default function Routes() {
  const { toast } = useToast();
  const distributorId = useAppSelector((s) => s.auth.user.id);

  // ============================================================
  //  ROUTES — existing API logic (unchanged)
  // ============================================================
  const { data: zones = [], isLoading: isLoadingZones } = useGetZonesQuery();

  const { data: orderBookers = [], isLoading: isLoadingOB } =
    useGetOrderBookersByDistributorQuery({
      distributor_id: distributorId,
    });

  const [zoneId, setZoneId] = useState<number | undefined>();
  const { data: routes = [], isLoading } = useGetRoutesQuery(
    zoneId
      ? { filterType: "zone", filterId: zoneId }
      : { filterType: "distributor", filterId: distributorId },
  );

  const isPageLoading = isLoadingZones || isLoadingOB || isLoading;

  const [createRoute, { isLoading: isCreating }] = useCreateRouteMutation();
  const [updateRoute, { isLoading: isUpdating }] = useUpdateRouteMutation();
  const [deleteRoute, { isLoading: isDeleting }] = useDeleteRouteMutation();
  const [assignRoute] = useAssignRouteMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [errors, setErrors] = useState<FormErrors<RouteFormData>>({});

  const [formData, setFormData] = useState<RouteFormData>({
    name: "",
    zone_id: "",
    order_booker_id: "",
  });

  const zoneMap = new Map<number, string>(
    zones.map((z: Zone) => [z.id, z.name]),
  );

  const orderBookerMap = new Map<number, string>(
    orderBookers.map((ob: OrderBooker) => [ob.id, ob.name]),
  );

  const openCreateDialog = () => {
    setEditingRoute(null);
    setFormData({ name: "", zone_id: "", order_booker_id: "" });
    setErrors({});
    setIsDialogOpen(true);
  };

  const openEditDialog = (route: Route) => {
    setEditingRoute(route);
    setFormData({
      name: route.name,
      zone_id: String(route.zone_id),
      order_booker_id: route.order_booker_id
        ? String(route.order_booker_id)
        : "",
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const clearFieldError = (field: keyof RouteFormData) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(routeSchema, formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const body: CreateRouteRequest | UpdateRouteRequest = {
        name: formData.name,
        zone_id: Number(formData.zone_id),

        ...(formData.order_booker_id && {
          order_booker_id: Number(formData.order_booker_id),
        }),
      };

      if (editingRoute) {
        await updateRoute({
          route_id: editingRoute.id,
          body: body as UpdateRouteRequest,
        }).unwrap();
        toast({ title: "Route Updated" });
      } else {
        await createRoute({
          distributor_id: distributorId,
          body: body as CreateRouteRequest,
        }).unwrap();
        toast({ title: "Route Created" });
      }

      setIsDialogOpen(false);
      setErrors({});
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.detail || "Operation failed",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRoute = async (routeId: number) => {
    try {
      await deleteRoute(routeId).unwrap();
      toast({ title: "Route Deleted" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.detail || "Failed to delete route",
        variant: "destructive",
      });
    }
  };

  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Route Name", sortable: true },
    {
      key: "zone_id",
      label: "Zone",
      render: (r: Route) => (
        <StatusBadge
          status="info"
          label={zoneMap.get(r.zone_id) ?? `Zone ${r.zone_id}`}
        />
      ),
    },
    {
      key: "order_booker_id",
      label: "Order Booker",
      render: (r: Route) =>
        r.order_booker_id
          ? (orderBookerMap.get(r.order_booker_id) ??
            `OB #${r.order_booker_id}`)
          : "Unassigned",
    },
  ];

  // ============================================================
  //  WEEKLY ROUTES — mock data logic
  // ============================================================
  const [schedules, setSchedules] = useState<WeeklyRouteSchedule[]>([]);
  const [weeklyLoading, setWeeklyLoading] = useState(true);

  const fetchSchedules = useCallback(() => {
    setWeeklyLoading(true);
    setTimeout(() => {
      setSchedules(MOCK_SCHEDULES);
      setWeeklyLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const createSchedule = async (payload: CreateWeeklyRoutePayload) => {
    await new Promise((r) => setTimeout(r, 1000));
    const newSchedule: WeeklyRouteSchedule = {
      id: Math.max(0, ...schedules.map((s) => s.id)) + 1,
      assignee_type: payload.assignee_type,
      assignee_id: payload.assignee_id,
      assignee_name: `Staff ${payload.assignee_id}`,
      route_id: payload.route_id,
      route_name: `Route ${payload.route_id}`,
      day_of_week: payload.day_of_week,
      is_active: true,
      created_by_distributor: 1,
      created_at: new Date().toISOString(),
    };
    setSchedules((prev) => [...prev, newSchedule]);
    toast({ title: "Schedule Created", description: "Weekly route schedule has been created successfully." });
  };

  const updateSchedule = async (scheduleId: number, payload: UpdateWeeklyRoutePayload) => {
    await new Promise((r) => setTimeout(r, 1000));
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === scheduleId
          ? { ...s, route_id: payload.route_id, day_of_week: payload.day_of_week, is_active: payload.is_active }
          : s,
      ),
    );
    toast({ title: "Schedule Updated", description: "Weekly route schedule has been updated successfully." });
  };

  // Weekly routes UI state
  const [viewSchedule, setViewSchedule] = useState<WeeklyRouteSchedule | null>(null);
  const [editSchedule, setEditSchedule] = useState<WeeklyRouteSchedule | null>(null);
  const [weeklyFormOpen, setWeeklyFormOpen] = useState(false);

  // Weekly form fields
  const [wfAssigneeType, setWfAssigneeType] = useState("order_booker");
  const [wfAssigneeId, setWfAssigneeId] = useState("");
  const [wfRouteId, setWfRouteId] = useState("");
  const [wfDayOfWeek, setWfDayOfWeek] = useState("1");
  const [wfIsActive, setWfIsActive] = useState(true);
  const [wfSubmitting, setWfSubmitting] = useState(false);

  const isWeeklyEdit = !!editSchedule;

  useEffect(() => {
    if (editSchedule) {
      setWfAssigneeType(editSchedule.assignee_type);
      setWfAssigneeId(String(editSchedule.assignee_id));
      setWfRouteId(String(editSchedule.route_id));
      setWfDayOfWeek(String(editSchedule.day_of_week));
      setWfIsActive(editSchedule.is_active);
    } else {
      setWfAssigneeType("order_booker");
      setWfAssigneeId("");
      setWfRouteId("");
      setWfDayOfWeek("1");
      setWfIsActive(true);
    }
  }, [editSchedule, weeklyFormOpen]);

  const openWeeklyCreate = () => {
    setEditSchedule(null);
    setWeeklyFormOpen(true);
  };

  const openWeeklyEdit = (s: WeeklyRouteSchedule) => {
    setEditSchedule(s);
    setWeeklyFormOpen(true);
  };

  const closeWeeklyForm = () => {
    setWeeklyFormOpen(false);
    setEditSchedule(null);
  };

  const handleWeeklyFormSubmit = async () => {
    setWfSubmitting(true);
    try {
      if (isWeeklyEdit && editSchedule) {
        await updateSchedule(editSchedule.id, {
          route_id: parseInt(wfRouteId),
          day_of_week: parseInt(wfDayOfWeek),
          is_active: wfIsActive,
        });
      } else {
        await createSchedule({
          assignee_type: wfAssigneeType,
          assignee_id: parseInt(wfAssigneeId),
          route_id: parseInt(wfRouteId),
          day_of_week: parseInt(wfDayOfWeek),
        });
      }
      closeWeeklyForm();
    } finally {
      setWfSubmitting(false);
    }
  };

  const isWeeklyFormValid = isWeeklyEdit
    ? wfRouteId && wfDayOfWeek
    : wfAssigneeType && wfAssigneeId && wfRouteId && wfDayOfWeek;

  const weeklyColumns = [
    { key: "id" as const, label: "ID", sortable: true },
    { key: "assignee_name" as const, label: "Assignee Name", sortable: true },
    {
      key: "assignee_type" as const,
      label: "Assignee Type",
      render: (s: WeeklyRouteSchedule) => assigneeTypeBadge(s.assignee_type),
    },
    { key: "route_name" as const, label: "Route Name", sortable: true },
    {
      key: "day_of_week" as const,
      label: "Day of Week",
      sortable: true,
      render: (s: WeeklyRouteSchedule) => (
        <span className="font-medium">{getDayName(s.day_of_week)}</span>
      ),
    },
    {
      key: "is_active" as const,
      label: "Status",
      render: (s: WeeklyRouteSchedule) => (
        <StatusBadge
          status={s.is_active ? "success" : "neutral"}
          label={s.is_active ? "Active" : "Inactive"}
        />
      ),
    },
    {
      key: "created_at" as const,
      label: "Created At",
      render: (s: WeeklyRouteSchedule) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(s.created_at), "MMM d, yyyy")}
        </span>
      ),
    },
  ];

  // Detail modal rows
  const detailRows = viewSchedule
    ? [
        { label: "ID", value: String(viewSchedule.id) },
        { label: "Assignee Name", value: viewSchedule.assignee_name },
        { label: "Assignee Type", value: assigneeTypeBadge(viewSchedule.assignee_type) },
        { label: "Route Name", value: viewSchedule.route_name },
        { label: "Day of Week", value: getDayName(viewSchedule.day_of_week) },
        {
          label: "Status",
          value: (
            <StatusBadge
              status={viewSchedule.is_active ? "success" : "neutral"}
              label={viewSchedule.is_active ? "Active" : "Inactive"}
            />
          ),
        },
        { label: "Created By Distributor", value: String(viewSchedule.created_by_distributor) },
        { label: "Created At", value: format(new Date(viewSchedule.created_at), "MMM d, yyyy h:mm a") },
      ]
    : [];

  // ============================================================
  //  RENDER
  // ============================================================
  if (isPageLoading) {
    return (
      <PageSkeleton
        statCards={0}
        tableColumns={4}
        tableRows={6}
        showHeader
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <RouteIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Routes</h1>
          <p className="text-sm text-muted-foreground">
            Manage delivery routes and staff assignments
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="routes">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger
            value="routes"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm px-5 py-2 text-sm gap-2"
          >
            Routes
          </TabsTrigger>
          <TabsTrigger
            value="weekly"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm px-5 py-2 text-sm gap-2"
          >
            Weekly Routes
          </TabsTrigger>
        </TabsList>

        {/* ===== Routes Tab ===== */}
        <TabsContent value="routes" className="space-y-6 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Filter by Zone ID"
                value={zoneId ?? ""}
                onChange={(e) =>
                  setZoneId(
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                className="w-40"
              />
              <Button onClick={openCreateDialog} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Route
              </Button>
            </div>
          </div>

          <DataTable
            data={routes}
            columns={columns}
            actions={(route) => (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditDialog(route)}
                  className="edit-btn-hover text-muted-foreground"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>

                <DeleteConfirmDialog
                  onConfirm={() => handleDeleteRoute(route.id)}
                  loading={isDeleting}
                />
              </div>
            )}
          />
        </TabsContent>

        {/* ===== Weekly Routes Tab ===== */}
        <TabsContent value="weekly" className="mt-6">
          {weeklyLoading ? (
            <div className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-44" />
              </div>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Weekly Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Weekly Route Schedules
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Manage weekly route assignments for your team
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="gap-2">
                    <CalendarDays className="w-4 h-4" />
                    Schedule Next 4 Weeks
                  </Button>
                  <Button className="gap-2" onClick={openWeeklyCreate}>
                    <Plus className="w-4 h-4" />
                    Create Weekly Route
                  </Button>
                </div>
              </div>

              {/* Weekly Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="stat-card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <CalendarDays className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{schedules.length}</p>
                      <p className="text-sm text-muted-foreground">Total Schedules</p>
                    </div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-success/10">
                      <CalendarDays className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {schedules.filter((s) => s.is_active).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Active</p>
                    </div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-info/10">
                      <CalendarDays className="w-5 h-5 text-info" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {schedules.filter((s) => s.assignee_type === "order_booker").length}
                      </p>
                      <p className="text-sm text-muted-foreground">Order Bookers</p>
                    </div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-warning/10">
                      <CalendarDays className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {schedules.filter((s) => s.assignee_type === "delivery_man").length}
                      </p>
                      <p className="text-sm text-muted-foreground">Delivery Men</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Table */}
              {schedules.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                  <CalendarDays className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No weekly route schedules found
                  </p>
                  <Button className="mt-4 gap-2" onClick={openWeeklyCreate}>
                    <Plus className="w-4 h-4" />
                    Create First Schedule
                  </Button>
                </div>
              ) : (
                <DataTable
                  data={schedules.map((s) => ({ ...s, id: String(s.id) }))}
                  columns={weeklyColumns.map((c) => ({
                    ...c,
                    render: c.render
                      ? (item: WeeklyRouteSchedule & { id: string }) =>
                          c.render!(item as unknown as WeeklyRouteSchedule)
                      : undefined,
                  }))}
                  actions={(item) => (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setViewSchedule(item as unknown as WeeklyRouteSchedule)
                        }
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          openWeeklyEdit(item as unknown as WeeklyRouteSchedule)
                        }
                        className="edit-btn-hover text-muted-foreground"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                />
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ===== Create / Edit Route Dialog ===== */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setErrors({});
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRoute ? "Update Route" : "Create Route"}
            </DialogTitle>
            <DialogDescription>
              {editingRoute
                ? "Update route details"
                : "Fill details to create a route"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <FormField label="Route Name" error={errors.name}>
              <Input
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  clearFieldError("name");
                }}
                placeholder="Enter route name"
              />
            </FormField>

            <FormField label="Zone" error={errors.zone_id}>
              <Select
                value={formData.zone_id}
                onValueChange={(value) => {
                  setFormData({ ...formData, zone_id: value, order_booker_id: "" });
                  clearFieldError("zone_id");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Zone" />
                </SelectTrigger>

                <SelectContent>
                  {zones.map((zone: Zone) => (
                    <SelectItem key={zone.id} value={String(zone.id)}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Order Booker" optional>
              <Select
                value={formData.order_booker_id}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    order_booker_id: value,
                  })
                }
                disabled={!formData.zone_id}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !formData.zone_id
                        ? "Select a zone first"
                        : orderBookers.filter(
                            (ob: OrderBooker) =>
                              ob.zone_id === Number(formData.zone_id),
                          ).length === 0
                          ? "No order bookers in this zone"
                          : "Select Order Booker (Optional)"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {orderBookers
                    .filter(
                      (ob: OrderBooker) =>
                        ob.zone_id === Number(formData.zone_id),
                    )
                    .map((ob: OrderBooker) => (
                      <SelectItem key={ob.id} value={String(ob.id)}>
                        {ob.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isCreating || isUpdating}>
              {editingRoute
                ? isUpdating
                  ? "Updating..."
                  : "Update Route"
                : isCreating
                  ? "Creating..."
                  : "Create Route"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Weekly Route Detail Modal ===== */}
      <Dialog
        open={!!viewSchedule}
        onOpenChange={(v) => !v && setViewSchedule(null)}
      >
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle>Weekly Route Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {detailRows.map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-center gap-4"
              >
                <span className="text-sm text-muted-foreground shrink-0">
                  {row.label}
                </span>
                <span className="text-sm font-medium text-right">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewSchedule(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Weekly Route Create / Edit Modal ===== */}
      <Dialog
        open={weeklyFormOpen}
        onOpenChange={(v) => !v && closeWeeklyForm()}
      >
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isWeeklyEdit ? "Edit Weekly Route" : "Create Weekly Route"}
            </DialogTitle>
            <DialogDescription>
              {isWeeklyEdit
                ? "Update the schedule details below."
                : "Fill in the details to create a new weekly route schedule."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!isWeeklyEdit && (
              <>
                <div className="space-y-2">
                  <Label>Assignee Type</Label>
                  <Select value={wfAssigneeType} onValueChange={setWfAssigneeType}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="order_booker">Order Booker</SelectItem>
                      <SelectItem value="delivery_man">Delivery Man</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assignee ID</Label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Enter assignee ID"
                    value={wfAssigneeId}
                    onChange={(e) => setWfAssigneeId(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label>Route ID</Label>
              <Input
                type="number"
                min={1}
                placeholder="Enter route ID"
                value={wfRouteId}
                onChange={(e) => setWfRouteId(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Day of Week</Label>
              <Select value={wfDayOfWeek} onValueChange={setWfDayOfWeek}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {WEEKLY_DAYS.map((d) => (
                    <SelectItem key={d} value={String(d)}>
                      {getDayName(d)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isWeeklyEdit && (
              <div className="flex items-center justify-between gap-3">
                <Label>Active</Label>
                <Switch checked={wfIsActive} onCheckedChange={setWfIsActive} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeWeeklyForm}>
              Cancel
            </Button>
            <Button
              onClick={handleWeeklyFormSubmit}
              disabled={!isWeeklyFormValid || wfSubmitting}
              className="gap-2"
            >
              {wfSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isWeeklyEdit ? "Update Schedule" : "Create Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
