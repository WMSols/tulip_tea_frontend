import { useAppSelector } from "@/Redux/Hooks/hooks";
import { useGetOrderBookersByDistributorQuery } from "@/Redux/Api/orderBookerApi";
import { useGetRoutesQuery } from "@/Redux/Api/routesApi";
import { useDeleteShopMutation } from "@/Redux/Api/shopsApi";
import { useToast } from "@/hooks/use-toast";
import { useShopsData } from "@/features/shops/hooks/useShopsData";
import { useShopFilters } from "@/features/shops/hooks/useShopFilters";
import { useShopActions } from "@/features/shops/hooks/useShopActions";
import { useShopDialogs } from "@/features/shops/hooks/useShopDialogs";
import { ShopsHeader } from "@/features/shops/components/ShopsHeader";
import { ShopsStats } from "@/features/shops/components/ShopsStats";
import { ShopsFilters } from "@/features/shops/components/ShopsFilters";
import { ShopsTable } from "@/features/shops/components/ShopsTable";
import { ViewDialog } from "@/features/shops/components/ShopDialogs/ViewDialog";
import { EditDialog } from "@/features/shops/components/ShopDialogs/EditDialog";
import { ReassignDialog } from "@/features/shops/components/ShopDialogs/ReassignDialog";
import { PageSkeleton } from "@/components/dashboard/PageSkeleton";

/**
 * Shops Page Component
 *
 * Main page for managing shops - viewing, approving, and reassigning.
 * Orchestrates data fetching, filtering, and dialog management.
 */
export default function Shops() {
  const { toast } = useToast();
  const distributorId = useAppSelector((s) => s.auth.user.id);

  // Data fetching and transformation
  const { shops, zones, stats, isLoading } = useShopsData();

  // Delete shop
  const [deleteShop, { isLoading: isDeleting }] = useDeleteShopMutation();

  // Order bookers for reassignment
  const { data: orderBookers = [], isLoading: isLoadingOB } =
    useGetOrderBookersByDistributorQuery({
      distributor_id: distributorId,
    });

  // Routes for filtering
  const { data: routes = [], isLoading: isLoadingRoutes } = useGetRoutesQuery({
    filterType: "distributor",
    filterId: distributorId,
  });

  const headerRefreshing = useAppSelector((s) => s.ui.headerRefreshing);
  const isPageLoading = isLoading || isLoadingOB || isLoadingRoutes || headerRefreshing;

  // Filtering logic
  const {
    activeTab,
    setActiveTab,
    filterZone,
    setFilterZone,
    filterRoute,
    setFilterRoute,
    zoneOptions,
    routeOptions,
    filteredShops,
  } = useShopFilters(shops, zones, routes);

  // Action handlers (approve, reject, reassign)
  const {
    handleApprove,
    handleReject,
    handleReassign,
    isVerifying,
    isReassigning,
  } = useShopActions(distributorId);

  // Dialog state management
  const {
    isViewDialogOpen,
    isEditDialogOpen,
    isReassignDialogOpen,
    selectedShop,
    selectedOrderBookerId,
    setSelectedOrderBookerId,
    handleViewShop,
    handleEditShop,
    handleReassignShop,
    closeViewDialog,
    closeEditDialog,
    closeReassignDialog,
  } = useShopDialogs();

  // Wrapper for approve with dialog close
  const handleApproveWithClose = (shopId: number) => {
    handleApprove(shopId, closeViewDialog);
  };

  // Wrapper for reject with dialog close
  const handleRejectWithClose = (shopId: number) => {
    handleReject(shopId, closeViewDialog);
  };

  // Wrapper for reassign with dialog close
  const handleReassignWithClose = () => {
    if (!selectedShop || !selectedOrderBookerId) return;
    handleReassign(selectedShop.id, selectedOrderBookerId, closeReassignDialog);
  };

  // Delete shop handler
  const handleDeleteShop = async (shopId: number) => {
    try {
      await deleteShop(shopId).unwrap();
      toast({ title: "Shop Deleted" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.detail || "Failed to delete shop",
        variant: "destructive",
      });
    }
  };

  if (isPageLoading) {
    return (
      <PageSkeleton
        statCards={4}
        statColumns={4}
        showFilters
        tableColumns={6}
        tableRows={6}
        showHeader
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <ShopsHeader />

      <ShopsStats
        totalCount={stats.totalCount}
        activeCount={stats.activeCount}
        pendingCount={stats.pendingCount}
        totalOutstanding={stats.totalOutstanding}
      />

      <ShopsFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        filterZone={filterZone}
        onZoneChange={setFilterZone}
        zoneOptions={zoneOptions}
        filterRoute={filterRoute}
        onRouteChange={setFilterRoute}
        routeOptions={routeOptions}
      />

      <ShopsTable
        data={filteredShops}
        isLoading={false}
        isVerifying={isVerifying}
        isDeleting={isDeleting}
        onView={handleViewShop}
        onApprove={handleApproveWithClose}
        onReject={handleRejectWithClose}
        onReassign={handleReassignShop}
        onDelete={handleDeleteShop}
      />

      <ViewDialog
        isOpen={isViewDialogOpen}
        onClose={closeViewDialog}
        shop={selectedShop}
        onApprove={handleApproveWithClose}
        onReject={handleRejectWithClose}
      />

      <EditDialog
        isOpen={isEditDialogOpen}
        onClose={closeEditDialog}
        shop={selectedShop}
      />

      <ReassignDialog
        isOpen={isReassignDialogOpen}
        onClose={closeReassignDialog}
        orderBookers={
          selectedShop
            ? orderBookers.filter((ob) => ob.zone_id === selectedShop.zoneId)
            : []
        }
        selectedOrderBookerId={selectedOrderBookerId}
        onOrderBookerChange={setSelectedOrderBookerId}
        onReassign={handleReassignWithClose}
        isReassigning={isReassigning}
      />
    </div>
  );
}
