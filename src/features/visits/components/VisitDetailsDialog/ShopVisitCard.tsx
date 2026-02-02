import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type { ShopVisitRow } from "../../types";
import { formatDateTime } from "../../utils/formatters";
import { getStaffRoleLabel } from "../../utils/helpers";

interface ShopVisitCardProps {
  visit: ShopVisitRow;
}

export function ShopVisitCard({ visit }: ShopVisitCardProps) {
  const isOrderBooking = visit.visit_types.includes("order_booking");
  const badgeStatus = isOrderBooking ? "info" : "neutral";
  const badgeLabel = isOrderBooking ? "Order Booking" : "Shop Visit";
  const roleLabel = getStaffRoleLabel(visit.staff_role);

  return (
    <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">Visit Info</p>
          <p className="font-semibold text-foreground leading-6">
            Visit #{visit.id}
          </p>
          <p className="text-xs text-muted-foreground">
            Shop{" "}
            <span className="font-medium text-foreground">
              {visit.shop_name}
            </span>
          </p>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-2">
          <StatusBadge status={badgeStatus as any} label={badgeLabel} />
          <div className="text-xs text-muted-foreground">
            Photos{" "}
            <span className="font-medium tabular-nums text-foreground">
              {visit.photos.length}
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
                  {formatDateTime(visit.visit_time)}
                </td>
              </tr>

              <tr className="border-b border-border">
                <td className="px-3 py-2 text-muted-foreground">Staff</td>
                <td className="px-3 py-2 text-right font-medium">
                  {visit.staff_name}{" "}
                  <span className="text-muted-foreground font-normal">
                    • {roleLabel}
                  </span>
                </td>
              </tr>

              <tr className="border-b border-border">
                <td className="px-3 py-2 text-muted-foreground">Visit Types</td>
                <td className="px-3 py-2 text-right font-medium break-words">
                  {visit.visit_types.length
                    ? visit.visit_types.join(", ")
                    : "-"}
                </td>
              </tr>

              <tr className="border-b border-border">
                <td className="px-3 py-2 text-muted-foreground">Order</td>
                <td className="px-3 py-2 text-right font-medium tabular-nums">
                  {visit.order_id ? `#${visit.order_id}` : "-"}
                </td>
              </tr>

              <tr className="border-b border-border">
                <td className="px-3 py-2 text-muted-foreground">
                  Collection ID
                </td>
                <td className="px-3 py-2 text-right font-medium tabular-nums">
                  {visit.collection_id ?? "-"}
                </td>
              </tr>

              <tr>
                <td className="px-3 py-2 text-muted-foreground">Reason</td>
                <td className="px-3 py-2 text-right font-medium break-words">
                  {visit.reason ?? "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
