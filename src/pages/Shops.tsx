import { useAppSelector } from "@/Redux/Hooks/hooks";
import { useGetOrderBookersByDistributorQuery } from "@/Redux/Api/orderBookerApi";
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
  const distributorId = useAppSelector((s) => s.auth.user.id);

  // Data fetching and transformation
  const { shops, zones, stats, isLoading } = useShopsData();

  // Order bookers for reassignment
  const { data: orderBookers = [], isLoading: isLoadingOB } =
    useGetOrderBookersByDistributorQuery({
      distributor_id: distributorId,
    });

  // Combined loading: wait for all data before showing page
  const isPageLoading = isLoading || isLoadingOB;

  // Filtering logic
  const {
    activeTab,
    setActiveTab,
    filterZone,
    setFilterZone,
    zoneOptions,
    filteredShops,
  } = useShopFilters(shops, zones);

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
      />

      <ShopsTable
        data={filteredShops}
        isLoading={false}
        isVerifying={isVerifying}
        onView={handleViewShop}
        onApprove={handleApproveWithClose}
        onReject={handleRejectWithClose}
        onReassign={handleReassignShop}
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
        orderBookers={orderBookers}
        selectedOrderBookerId={selectedOrderBookerId}
        onOrderBookerChange={setSelectedOrderBookerId}
        onReassign={handleReassignWithClose}
        isReassigning={isReassigning}
      />
    </div>
  );
}
