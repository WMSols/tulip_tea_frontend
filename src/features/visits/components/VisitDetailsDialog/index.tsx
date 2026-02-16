import { ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { VisitRow } from "../../types";
import type { OrderDto } from "@/types/visits";
import { formatDateTime } from "../../utils/formatters";
import {
  zoneLabel,
  getVisitDisplayTime,
  formatVisitTypeLabel,
  getVisitTypeBadgeStatus,
} from "../../utils/helpers";
import { LocationLinks } from "./LocationLinks";
import { PhotosSection } from "./PhotosSection";
import { ShopVisitCard } from "./ShopVisitCard";
import { DeliveryCard } from "./DeliveryCard";
import { OrderDetailsSection } from "./OrderDetailsSection";

interface VisitDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  visit: VisitRow | null;
  orderData: OrderDto | undefined;
  isOrderFetching: boolean;
  isOrderError: boolean;
  zoneMap?: Record<number, string>;
}

export function VisitDetailsDialog({
  isOpen,
  onClose,
  visit,
  orderData,
  isOrderFetching,
  isOrderError,
  zoneMap = {},
}: VisitDetailsDialogProps) {
  if (!visit) return null;

  const displayTime = getVisitDisplayTime(visit);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Details</DialogTitle>
          <DialogDescription>
            {visit.kind === "delivery"
              ? "Delivery details"
              : "Shop visit details"}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="overflow-y-auto pr-2 max-h-[65vh]">
          <div className="space-y-4 py-4">
            {/* Header Section */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{visit.shop_name}</h3>
                <p className="text-muted-foreground">
                  {formatDateTime(displayTime)}
                </p>
              </div>
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Zone</p>
                <StatusBadge
                  status="neutral"
                  label={zoneMap[visit.shop_zone_id] || zoneLabel(visit.shop_zone_id)}
                />
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Type</p>
                {visit.kind === "delivery" ? (
                  <StatusBadge status="success" label="Delivery" />
                ) : visit.visit_types.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {visit.visit_types.map((t) => (
                      <StatusBadge
                        key={t}
                        status={getVisitTypeBadgeStatus(t)}
                        label={formatVisitTypeLabel(t)}
                      />
                    ))}
                  </div>
                ) : (
                  <StatusBadge status="neutral" label="Shop Visit" />
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Staff</p>
                <p className="font-medium">
                  {visit.kind === "shop_visit"
                    ? visit.staff_name
                    : visit.delivery_man_name}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Order</p>
                <p className="font-medium">
                  {visit.kind === "delivery"
                    ? `#${visit.order_id}`
                    : visit.order_id
                      ? `#${visit.order_id}`
                      : "-"}
                </p>
              </div>
            </div>

            {/* Location Links */}
            <div className="grid grid-cols-1 gap-2">
              <LocationLinks visit={visit} />
            </div>

            {/* Visit/Delivery Specific Card */}
            {visit.kind === "shop_visit" ? (
              <ShopVisitCard visit={visit} />
            ) : (
              <DeliveryCard delivery={visit} />
            )}

            {/* Photos Section */}
            {visit.kind === "shop_visit" && (
              <PhotosSection photos={visit.photos} label="Photos" />
            )}
            {visit.kind === "delivery" && (
              <PhotosSection
                photos={visit.delivery_images}
                label="Delivery Images"
              />
            )}

            {/* Order Details Section */}
            <OrderDetailsSection
              orderId={
                visit.kind === "delivery" ? visit.order_id : visit.order_id
              }
              orderData={orderData}
              isOrderFetching={isOrderFetching}
              isOrderError={isOrderError}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
