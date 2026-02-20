import { useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/Redux/Hooks/hooks";
import { useGetZonesQuery } from "@/Redux/Api/zonesApi";
import { useVisitsData } from "@/features/visits/hooks/useVisitsData";
import { useVisitFilters } from "@/features/visits/hooks/useVisitFilters";
import { useVisitDetails } from "@/features/visits/hooks/useVisitDetails";
import { VisitsHeader } from "@/features/visits/components/VisitsHeader";
import { VisitsStats } from "@/features/visits/components/VisitsStats";
import { VisitsFilters } from "@/features/visits/components/VisitsFilters";
import { VisitsTable } from "@/features/visits/components/VisitsTable";
import { VisitDetailsDialog } from "@/features/visits/components/VisitDetailsDialog";
import { PageSkeleton } from "@/components/dashboard/PageSkeleton";

/**
 * Visits Page Component
 *
 * Displays shop visits and deliveries with filtering and details view.
 * This is the main orchestrator component that delegates responsibilities
 * to specialized child components and custom hooks.
 */
export default function Visits() {
  const { toast } = useToast();

  // Data fetching and transformation
  const { rows, isLoading, isError } = useVisitsData();
  const headerRefreshing = useAppSelector((s) => s.ui.headerRefreshing);

  // Zones for filter names and display
  const { data: zones = [] } = useGetZonesQuery();

  const zoneMap = useMemo(() => {
    const map: Record<number, string> = {};
    for (const z of zones) map[z.id] = z.name;
    return map;
  }, [zones]);

  // Filtering and stats
  const {
    activeTab,
    setActiveTab,
    filterZone,
    setFilterZone,
    filterRoute,
    setFilterRoute,
    zoneOptions,
    routeOptions,
    filteredRows,
    stats,
  } = useVisitFilters(rows, zones);

  // Details dialog management
  const {
    isDialogOpen,
    selected,
    orderData,
    isOrderFetching,
    isOrderError,
    handleViewDetails,
    handleCloseDialog,
  } = useVisitDetails();

  // Error toast notification
  useEffect(() => {
    if (isError) {
      toast({
        title: "Failed to load",
        description: "Could not fetch visits/deliveries. Please try again.",
        variant: "destructive" as any,
      });
    }
  }, [isError, toast]);

  if (isLoading || headerRefreshing) {
    return (
      <PageSkeleton
        statCards={3}
        statColumns={3}
        showFilters
        tableColumns={6}
        tableRows={8}
        showHeader
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <VisitsHeader />

      <VisitsStats
        totalCount={stats.totalCount}
        orderBookingCount={stats.orderBookingCount}
        deliveriesCount={stats.deliveriesCount}
      />

      <VisitsFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        filterZone={filterZone}
        onZoneChange={setFilterZone}
        zoneOptions={zoneOptions}
        filterRoute={filterRoute}
        onRouteChange={setFilterRoute}
        routeOptions={routeOptions}
      />

      <VisitsTable
        data={filteredRows}
        isLoading={false}
        onViewDetails={handleViewDetails}
        zoneMap={zoneMap}
      />

      <VisitDetailsDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        visit={selected}
        orderData={orderData}
        isOrderFetching={isOrderFetching}
        isOrderError={isOrderError}
        zoneMap={zoneMap}
      />
    </div>
  );
}
