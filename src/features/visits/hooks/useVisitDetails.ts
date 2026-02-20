import { useEffect, useState } from "react";
import type { VisitRow } from "../types";
import {
  useLazyGetOrderByIdQuery,
  useLazyGetDailyCollectionByIdQuery,
} from "@/Redux/Api/visitsApi";

/**
 * Hook to manage visit details dialog state
 */
export function useVisitDetails() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selected, setSelected] = useState<VisitRow | null>(null);

  const [
    fetchOrder,
    { data: orderData, isFetching: isOrderFetching, isError: isOrderError },
  ] = useLazyGetOrderByIdQuery();

  const [
    fetchCollection,
    {
      data: collectionData,
      isFetching: isCollectionFetching,
      isError: isCollectionError,
    },
  ] = useLazyGetDailyCollectionByIdQuery();

  // Fetch order details when dialog opens and selected has order_id
  useEffect(() => {
    if (!isDialogOpen || !selected) return;
    const orderId =
      selected.kind === "delivery" ? selected.order_id : selected.order_id;
    if (!orderId) return;
    fetchOrder({ orderId });
  }, [isDialogOpen, selected, fetchOrder]);

  // Fetch daily collection when dialog opens and selected has collection_id (shop_visit only)
  useEffect(() => {
    if (!isDialogOpen || !selected || selected.kind !== "shop_visit") return;
    const collectionId = selected.collection_id;
    if (collectionId == null) return;
    fetchCollection({ collectionId });
  }, [isDialogOpen, selected, fetchCollection]);

  const handleViewDetails = (row: VisitRow) => {
    setSelected(row);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return {
    isDialogOpen,
    selected,
    orderData,
    isOrderFetching,
    isOrderError,
    collectionData,
    isCollectionFetching,
    isCollectionError,
    handleViewDetails,
    handleCloseDialog,
  };
}
