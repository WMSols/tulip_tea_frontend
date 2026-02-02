import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type { DeliveryRow } from "../../types";
import { formatDateTime } from "../../utils/formatters";
import { getDeliveryBadgeStatus } from "../../utils/helpers";

interface DeliveryCardProps {
  delivery: DeliveryRow;
}

export function DeliveryCard({ delivery }: DeliveryCardProps) {
  const badgeStatus = getDeliveryBadgeStatus(delivery.status);

  return (
    <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">Delivery Info</p>
          <p className="font-semibold text-foreground leading-6">
            Delivery #{delivery.id}
          </p>
          <p className="text-xs text-muted-foreground">
            Order{" "}
            <span className="font-medium tabular-nums text-foreground">
              #{delivery.order_id}
            </span>
          </p>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-2">
          <StatusBadge status={badgeStatus as any} label={delivery.status} />
          <div className="text-xs text-muted-foreground">
            Items{" "}
            <span className="font-medium tabular-nums text-foreground">
              {delivery.delivery_items_count}
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
                  {formatDateTime(delivery.picked_up_at)}
                </td>
              </tr>

              <tr className="border-b border-border">
                <td className="px-3 py-2 text-muted-foreground">Delivered</td>
                <td className="px-3 py-2 text-right font-medium tabular-nums">
                  {formatDateTime(delivery.delivered_at)}
                </td>
              </tr>

              <tr className="border-b border-border">
                <td className="px-3 py-2 text-muted-foreground">Returned</td>
                <td className="px-3 py-2 text-right font-medium tabular-nums">
                  {formatDateTime(delivery.returned_at)}
                </td>
              </tr>

              <tr className="border-b border-border">
                <td className="px-3 py-2 text-muted-foreground">
                  Return Reason
                </td>
                <td className="px-3 py-2 text-right font-medium break-words">
                  {delivery.return_reason ?? "-"}
                </td>
              </tr>

              <tr>
                <td className="px-3 py-2 text-muted-foreground">Remarks</td>
                <td className="px-3 py-2 text-right font-medium break-words">
                  {delivery.delivery_remarks ?? "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
